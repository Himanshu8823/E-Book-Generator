import { createClient } from "@/lib/supabase/server"
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx"

export async function POST(req: Request) {
  try {
    const { documentId, format, title, content } = await req.json()

    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: document, error: docError } = await supabase
      .from("documents")
      .select("*")
      .eq("id", documentId)
      .eq("user_id", user.id)
      .single()

    if (docError || !document) {
      return Response.json({ error: "Document not found" }, { status: 404 })
    }

    let exportContent: Buffer | string
    let contentType: string
    let filename: string

    switch (format) {
      case "markdown":
        exportContent = convertToMarkdown(content)
        contentType = "text/markdown; charset=utf-8"
        filename = `${title}.md`
        return new Response(exportContent, {
          headers: {
            "Content-Type": contentType,
            "Content-Disposition": `attachment; filename="${encodeURIComponent(filename)}"`,
          },
        })

      case "html":
        exportContent = convertToHTML(content, title)
        contentType = "text/html; charset=utf-8"
        filename = `${title}.html`
        return new Response(exportContent, {
          headers: {
            "Content-Type": contentType,
            "Content-Disposition": `attachment; filename="${encodeURIComponent(filename)}"`,
          },
        })

      case "pdf":
        exportContent = convertToPrintableHTML(content, title)
        contentType = "text/html; charset=utf-8"
        filename = `${title}-print.html`
        return new Response(exportContent, {
          headers: {
            "Content-Type": contentType,
          },
        })

      case "docx":
        exportContent = await convertToDocx(content, title)
        contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        filename = `${title}.docx`
        return new Response(exportContent, {
          headers: {
            "Content-Type": contentType,
            "Content-Disposition": `attachment; filename="${encodeURIComponent(filename)}"`,
            "Content-Length": exportContent.length.toString(),
          },
        })

      default:
        return Response.json({ error: "Invalid format" }, { status: 400 })
    }
  } catch (error) {
    console.error("[v0] Export error:", error)
    return Response.json({ error: "Export failed", details: String(error) }, { status: 500 })
  }
}

async function convertToDocx(content: any, title: string): Promise<Buffer> {
  const children: any[] = []

  // Add title
  children.push(
    new Paragraph({
      text: title,
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    }),
  )

  // Process content nodes
  const processNode = (node: any): any[] => {
    const result: any[] = []

    switch (node.type) {
      case "heading":
        const headingLevel = [
          HeadingLevel.HEADING_1,
          HeadingLevel.HEADING_2,
          HeadingLevel.HEADING_3,
          HeadingLevel.HEADING_4,
          HeadingLevel.HEADING_5,
          HeadingLevel.HEADING_6,
        ][node.attrs?.level - 1 || 0]
        
        // Font sizes for headings (in half-points, so 32 = 16pt)
        const headingSizes = [48, 40, 32, 28, 24, 22] // H1=24pt, H2=20pt, H3=16pt, etc.
        const fontSize = headingSizes[node.attrs?.level - 1 || 0]

        result.push(
          new Paragraph({
            text: extractText(node),
            heading: headingLevel,
            spacing: { before: 240, after: 120 },
            run: {
              size: fontSize,
              bold: true,
            },
          }),
        )
        break

      case "paragraph":
        const runs: TextRun[] = []
        if (node.content) {
          node.content.forEach((child: any) => {
            if (child.type === "text") {
              const textProps: any = { text: child.text || "", size: 24 } // Default 12pt

              if (child.marks) {
                child.marks.forEach((mark: any) => {
                  if (mark.type === "bold") textProps.bold = true
                  if (mark.type === "italic") textProps.italics = true
                  if (mark.type === "underline") textProps.underline = {}
                  if (mark.type === "strike") textProps.strike = true
                  if (mark.type === "code") {
                    textProps.font = "Courier New"
                    textProps.size = 20 // 10pt for code
                  }
                  // Handle font size from textStyle mark
                  if (mark.type === "textStyle" && mark.attrs?.fontSize) {
                    const size = parseInt(mark.attrs.fontSize)
                    if (!isNaN(size)) {
                      textProps.size = size * 2 // Convert pt to half-points
                    }
                  }
                  // Handle font family from textStyle mark
                  if (mark.type === "textStyle" && mark.attrs?.fontFamily) {
                    textProps.font = mark.attrs.fontFamily
                  }
                })
              }

              runs.push(new TextRun(textProps))
            }
          })
        }

        result.push(
          new Paragraph({
            children: runs.length > 0 ? runs : [new TextRun("")],
            spacing: { after: 120 },
          }),
        )
        break

      case "bulletList":
        if (node.content) {
          node.content.forEach((item: any) => {
            result.push(
              new Paragraph({
                text: extractText(item),
                bullet: { level: 0 },
                spacing: { after: 60 },
              }),
            )
          })
        }
        break

      case "orderedList":
        if (node.content) {
          node.content.forEach((item: any, index: number) => {
            result.push(
              new Paragraph({
                text: extractText(item),
                numbering: { reference: "default-numbering", level: 0 },
                spacing: { after: 60 },
              }),
            )
          })
        }
        break

      case "blockquote":
        result.push(
          new Paragraph({
            text: extractText(node),
            italics: true,
            indent: { left: 720 },
            spacing: { before: 120, after: 120 },
          }),
        )
        break

      case "codeBlock":
        result.push(
          new Paragraph({
            text: extractText(node),
            font: "Courier New",
            shading: { fill: "F5F5F5" },
            spacing: { before: 120, after: 120 },
          }),
        )
        break

      case "hardBreak":
        result.push(new Paragraph({ text: "" }))
        break
    }

    return result
  }

  const extractText = (node: any): string => {
    if (node.type === "text") return node.text || ""
    if (!node.content) return ""
    return node.content.map(extractText).join("")
  }

  if (content?.content) {
    content.content.forEach((node: any) => {
      children.push(...processNode(node))
    })
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children: children,
      },
    ],
    numbering: {
      config: [
        {
          reference: "default-numbering",
          levels: [
            {
              level: 0,
              format: "decimal",
              text: "%1.",
              alignment: AlignmentType.START,
            },
          ],
        },
      ],
    },
  })

  return await Packer.toBuffer(doc)
}

function convertToMarkdown(content: any): string {
  if (!content) return ""

  let markdown = ""

  const processNode = (node: any): string => {
    let result = ""

    switch (node.type) {
      case "heading":
        const level = "#".repeat(node.attrs?.level || 1)
        result += `${level} ${node.content?.map(processNode).join("") || ""}\n\n`
        break

      case "paragraph":
        result += `${node.content?.map(processNode).join("") || ""}\n\n`
        break

      case "text":
        let text = node.text || ""
        if (node.marks) {
          node.marks.forEach((mark: any) => {
            switch (mark.type) {
              case "bold":
                text = `**${text}**`
                break
              case "italic":
                text = `*${text}*`
                break
              case "code":
                text = `\`${text}\``
                break
              case "strike":
                text = `~~${text}~~`
                break
              case "underline":
                text = `<u>${text}</u>`
                break
            }
          })
        }
        result += text
        break

      case "bulletList":
        node.content?.forEach((item: any) => {
          result += `- ${processListItem(item)}\n`
        })
        result += "\n"
        break

      case "orderedList":
        node.content?.forEach((item: any, index: number) => {
          result += `${index + 1}. ${processListItem(item)}\n`
        })
        result += "\n"
        break

      case "listItem":
        result += processListItem(node)
        break

      case "blockquote":
        result += `> ${node.content?.map(processNode).join("")}\n\n`
        break

      case "codeBlock":
        result += `\`\`\`${node.attrs?.language || ""}\n${node.content?.map(processNode).join("") || ""}\n\`\`\`\n\n`
        break

      case "hardBreak":
        result += "  \n"
        break

      case "image":
        result += `![${node.attrs?.alt || ""}](${node.attrs?.src || ""})\n\n`
        break

      case "table":
        result += processTable(node)
        break
    }

    return result
  }

  const processListItem = (item: any): string => {
    return item.content?.map(processNode).join("").trim() || ""
  }

  const processTable = (table: any): string => {
    let result = ""
    const rows = table.content || []

    rows.forEach((row: any, rowIndex: number) => {
      const cells = row.content || []
      result += "|"
      cells.forEach((cell: any) => {
        result += ` ${cell.content?.map(processNode).join("").trim() || ""} |`
      })
      result += "\n"

      // Add header separator after first row
      if (rowIndex === 0) {
        result += "|"
        cells.forEach(() => {
          result += " --- |"
        })
        result += "\n"
      }
    })

    return result + "\n"
  }

  if (content.content) {
    markdown = content.content.map(processNode).join("")
  } else if (typeof content === "string") {
    // If content is already a string, return it
    return content
  }

  return markdown
}

function convertToHTML(content: any, title: string): string {
  const htmlContent = convertContentToHTML(content)

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      color: #333;
    }
    h1, h2, h3, h4, h5, h6 {
      margin-top: 1.5em;
      margin-bottom: 0.5em;
      font-weight: 600;
      color: #1a1a1a;
    }
    h1 { font-size: 2.5em; }
    h2 { font-size: 2em; }
    h3 { font-size: 1.5em; }
    h4 { font-size: 1.25em; }
    p {
      margin-bottom: 1em;
    }
    strong { font-weight: 600; }
    em { font-style: italic; }
    u { text-decoration: underline; }
    code {
      background-color: #f4f4f4;
      padding: 0.2em 0.4em;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
      font-size: 0.9em;
    }
    pre {
      background-color: #f4f4f4;
      padding: 1em;
      border-radius: 5px;
      overflow-x: auto;
    }
    pre code {
      background: none;
      padding: 0;
    }
    blockquote {
      border-left: 4px solid #ddd;
      padding-left: 1em;
      color: #666;
      margin: 1em 0;
    }
    ul, ol {
      margin: 1em 0;
      padding-left: 2em;
    }
    li {
      margin-bottom: 0.5em;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 1em 0;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 0.75em;
      text-align: left;
    }
    th {
      background-color: #f4f4f4;
      font-weight: 600;
    }
    img {
      max-width: 100%;
      height: auto;
    }
  </style>
</head>
<body>
  ${htmlContent}
</body>
</html>`

  return html
}

function convertContentToHTML(content: any): string {
  if (!content) return ""

  const processNode = (node: any): string => {
    let result = ""

    switch (node.type) {
      case "doc":
        result = node.content?.map(processNode).join("") || ""
        break

      case "heading":
        const level = node.attrs?.level || 1
        const headingContent = node.content?.map(processNode).join("") || ""
        result = `<h${level}>${headingContent}</h${level}>`
        break

      case "paragraph":
        const paraContent = node.content?.map(processNode).join("") || ""
        result = `<p>${paraContent}</p>`
        break

      case "text":
        let text = node.text || ""
        if (node.marks) {
          node.marks.forEach((mark: any) => {
            switch (mark.type) {
              case "bold":
                text = `<strong>${text}</strong>`
                break
              case "italic":
                text = `<em>${text}</em>`
                break
              case "underline":
                text = `<u>${text}</u>`
                break
              case "strike":
                text = `<s>${text}</s>`
                break
              case "code":
                text = `<code>${text}</code>`
                break
              case "textStyle":
                if (mark.attrs?.color) {
                  text = `<span style="color: ${mark.attrs.color}">${text}</span>`
                }
                if (mark.attrs?.fontSize) {
                  text = `<span style="font-size: ${mark.attrs.fontSize}">${text}</span>`
                }
                if (mark.attrs?.fontFamily) {
                  text = `<span style="font-family: ${mark.attrs.fontFamily}">${text}</span>`
                }
                break
            }
          })
        }
        result = text
        break

      case "bulletList":
        const bulletItems = node.content?.map((item: any) => processNode(item)).join("") || ""
        result = `<ul>${bulletItems}</ul>`
        break

      case "orderedList":
        const orderedItems = node.content?.map((item: any) => processNode(item)).join("") || ""
        result = `<ol>${orderedItems}</ol>`
        break

      case "listItem":
        const itemContent = node.content?.map(processNode).join("") || ""
        result = `<li>${itemContent}</li>`
        break

      case "blockquote":
        const quoteContent = node.content?.map(processNode).join("") || ""
        result = `<blockquote>${quoteContent}</blockquote>`
        break

      case "codeBlock":
        const codeContent = node.content?.map(processNode).join("") || ""
        result = `<pre><code>${codeContent}</code></pre>`
        break

      case "hardBreak":
        result = "<br>"
        break

      case "image":
        result = `<img src="${node.attrs?.src || ""}" alt="${node.attrs?.alt || ""}" />`
        break

      case "table":
        const tableContent = node.content?.map(processNode).join("") || ""
        result = `<table>${tableContent}</table>`
        break

      case "tableRow":
        const rowContent = node.content?.map(processNode).join("") || ""
        result = `<tr>${rowContent}</tr>`
        break

      case "tableHeader":
        const headerContent = node.content?.map(processNode).join("") || ""
        result = `<th>${headerContent}</th>`
        break

      case "tableCell":
        const cellContent = node.content?.map(processNode).join("") || ""
        result = `<td>${cellContent}</td>`
        break

      case "horizontalRule":
        result = "<hr>"
        break
    }

    return result
  }

  if (content.content) {
    return content.content.map(processNode).join("")
  } else if (typeof content === "string") {
    return content
  }

  return processNode(content)
}

function convertToPrintableHTML(content: any, title: string): string {
  const htmlContent = convertContentToHTML(content)

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    @page {
      size: A4;
      margin: 25mm;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 12pt;
      line-height: 1.6;
      color: #000;
      background: white;
      counter-reset: page;
    }
    
    @media print {
      body {
        margin: 0;
        padding: 0;
      }
      
      h1, h2, h3, h4, h5, h6 {
        page-break-after: avoid;
        page-break-inside: avoid;
      }
      
      p, li {
        orphans: 3;
        widows: 3;
      }
      
      pre, blockquote, table, img {
        page-break-inside: avoid;
      }
      
      @page {
        @bottom-center {
          content: counter(page);
          font-size: 10pt;
          color: #666;
        }
      }
    }
    
    h1 {
      font-size: 24pt;
      margin: 0 0 24pt 0;
      text-align: center;
      font-weight: bold;
    }
    
    h2 {
      font-size: 18pt;
      margin: 18pt 0 12pt 0;
      font-weight: bold;
    }
    
    h3 {
      font-size: 14pt;
      margin: 14pt 0 10pt 0;
      font-weight: bold;
    }
    
    h4 {
      font-size: 12pt;
      margin: 12pt 0 8pt 0;
      font-weight: bold;
    }
    
    p {
      margin-bottom: 12pt;
      text-align: justify;
    }
    
    strong { font-weight: bold; }
    em { font-style: italic; }
    u { text-decoration: underline; }
    s { text-decoration: line-through; }
    
    code {
      font-family: 'Courier New', monospace;
      font-size: 10pt;
      background: #f5f5f5;
      padding: 2px 4px;
      border-radius: 2px;
    }
    
    pre {
      font-family: 'Courier New', monospace;
      font-size: 10pt;
      padding: 12pt;
      background: #f5f5f5;
      border: 1px solid #ddd;
      overflow-x: auto;
      margin: 12pt 0;
    }
    
    pre code {
      background: none;
      padding: 0;
    }
    
    blockquote {
      border-left: 3px solid #ddd;
      padding-left: 12pt;
      margin: 12pt 0;
      font-style: italic;
      color: #555;
    }
    
    ul, ol {
      margin: 12pt 0;
      padding-left: 24pt;
    }
    
    li {
      margin-bottom: 6pt;
    }
    
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 12pt 0;
    }
    
    th, td {
      border: 1px solid #000;
      padding: 6pt;
      text-align: left;
    }
    
    th {
      background-color: #f0f0f0;
      font-weight: bold;
    }
    
    img {
      max-width: 100%;
      height: auto;
      display: block;
      margin: 12pt auto;
    }
  </style>
</head>
<body>
  <h1>${title}</h1>
  ${htmlContent}
  <script>
    // Auto-trigger print dialog
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 100);
    }
  </script>
</body>
</html>`

  return html
}
