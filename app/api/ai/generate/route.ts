import { createClient } from "@/lib/supabase/server"

export const maxDuration = 60

const PROJECT_REPORT_STRUCTURE = `
For project reports, follow this academic structure:

1. Title Page: Project title, submitted by (student names), institution details, guide name, academic year
2. Certificate: Official certification statement with signatures section
3. Acknowledgement: Formal thanks to guide, HOD, institution, parents, and contributors
4. List of Tables & Figures: Organized reference tables
5. Abstract: Comprehensive summary (200-300 words) covering objective, methodology, results, and conclusion
6. Introduction: Background, motivation, problem definition, scope, objectives, life cycle model, organization of report
7. Project Planning: Feasibility study, risk analysis, scheduling, effort allocation, cost estimation
8. Analysis: Requirement collection, hardware/software requirements, functional/non-functional requirements, SRS
9. Design: System architecture, data flow diagrams, UML diagrams (use case, sequence, activity), flowcharts
10. Implementation: Algorithms, development tools, modules description with code explanations
11. Testing: Black box testing, white box testing, test cases with results
12. Results and Discussion: Screenshots, performance analysis, comparative study
13. Conclusion & Future Work: Summary of achievements, limitations, future enhancements
14. References: IEEE format citations

Use formal academic language, include detailed tables, proper figure references, and comprehensive technical explanations.
`

export async function POST(req: Request) {
  try {
    const { prompt, documentId, model = "llama-3.3-70b-versatile", documentType, currentContent } = await req.json()

    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Build context-aware system prompt
    let contextPrompt = ""
    if (currentContent && currentContent.trim().length > 0) {
      contextPrompt = `\n\nCRITICAL - EXISTING DOCUMENT CONTEXT:
The user has already written content in their document. Here is what exists:

${currentContent.substring(0, 3000)} ${currentContent.length > 3000 ? '...(content continues)' : ''}

YOUR TASK - READ THIS CAREFULLY:
- If user asks to "expand" → Add MUCH more detail, examples, descriptions to the existing content (minimum 500 words)
- If user asks to "continue" → Write the next part of the story/article naturally (minimum 500 words)
- If user requests something new → Add it as a complementary new section (minimum 400 words)
- MATCH the exact writing style, tone, genre, and voice of the existing content
- DO NOT repeat what's already written - only ADD new content
- DO NOT suddenly switch to technical/generic content if they're writing a story
- If it's a story (fiction), continue with plot, dialogue, descriptions, character development
- If it's creative writing, maintain the same narrative voice and atmosphere
- If it's an article/essay, expand with more facts, examples, analysis, perspectives
- If it's academic, add scholarly depth with citations and detailed explanations

CONTENT LENGTH REQUIREMENTS:
- "Expand" requests: MINIMUM 500 words of detailed additions
- "Continue" requests: MINIMUM 500 words of continuation
- General requests: MINIMUM 400 words
- Be comprehensive, detailed, and engaging throughout

Remember: You're a creative extension of their work, not a generic content generator!`
    }

    const systemPrompt =
      documentType === "project-report"
        ? `You are a professional academic writer specialized in creating detailed project reports and technical documentation. 

${PROJECT_REPORT_STRUCTURE}

STRICT OUTPUT RULES:
1. Return ONLY clean, semantic HTML (use <h2>, <h3>, <p>, <ul>, <ol>, <li>, <strong>, <em>, <table>, <tr>, <td>)
2. NEVER use markdown (no **, *, _, #, etc.)
3. NEVER use asterisks (*) for ANY purpose
4. NEVER add page numbers, borders, or CSS styling
5. Generate comprehensive content (MINIMUM 1000 words)
6. Use proper academic formatting with detailed paragraphs (6-8 sentences each)
7. Include tables where appropriate for project data
8. Maintain formal, scholarly tone throughout

${contextPrompt}

Generate detailed academic content in proper HTML format now!`
        : `You are a professional writer and content creator. You MUST follow these rules STRICTLY:

OUTPUT FORMAT RULES (CRITICAL):
1. Return ONLY clean, semantic HTML tags
2. NEVER use markdown syntax (no **, *, _, ~, etc.)
3. NEVER use asterisks (*) for any purpose
4. NEVER use special characters like *, #, -, or _ for formatting
5. DO NOT add page numbers, page breaks, or CSS styling
6. Use ONLY these HTML tags: <h2>, <h3>, <h4>, <p>, <ul>, <ol>, <li>, <strong>, <em>, <u>, <blockquote>, <code>, <pre>, <table>, <tr>, <td>, <th>

CONTENT QUALITY AND LENGTH RULES (VERY IMPORTANT):
1. Generate COMPREHENSIVE, DETAILED content (MINIMUM 600-800 words per request, aim for 1000+ words when possible)
2. Write RICH, detailed paragraphs (6-10 sentences each with vivid descriptions and examples)
3. Include multiple relevant examples, case studies, vivid descriptions, and engaging details in EVERY response
4. Use clear section hierarchies with proper headings when appropriate
5. Maintain consistent, engaging tone and style throughout
6. Make content INTERESTING, IMMERSIVE, and enjoyable to read - avoid generic or surface-level content
7. For stories: Include dialogue, character thoughts, sensory details, scene descriptions (MINIMUM 600 words)
8. For articles: Include statistics, expert opinions, real examples, detailed explanations (MINIMUM 700 words)
9. For creative writing: Use literary devices, imagery, metaphors, detailed world-building (MINIMUM 600 words)
10. NEVER write short, generic, or technical content unless specifically requested

ENGAGEMENT RULES:
- Make every paragraph count with substance and depth
- Use storytelling techniques even for non-fiction
- Include specific details, not vague generalizations
- Write as if you're an expert passionate about the topic

${contextPrompt}

Generate DETAILED, COMPREHENSIVE, ENGAGING content now! Remember: More is better - aim for depth and richness!`

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 8000, // Increased for longer content
        temperature: 0.8, // Slightly higher for more creative output
        stream: false,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("[v0] Groq API error:", error)
      return Response.json({ error: "Failed to generate content" }, { status: response.status })
    }

    const completion = await response.json()
    let generatedText = completion.choices[0]?.message?.content || ""

    generatedText = generatedText
      .replace(/\*\*\*\*/g, "")
      .replace(/\*\*\*/g, "")
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/_{4}/g, "")
      .replace(/_{3}/g, "")
      .replace(/__/g, "")
      .replace(/##+/g, "")
      .trim()

    if (documentId) {
      await supabase.from("ai_generations").insert({
        user_id: user.id,
        document_id: documentId,
        prompt,
        generated_content: generatedText,
        model,
        tokens_used: completion.usage?.total_tokens || 0,
      })
    }

    return Response.json({
      html: generatedText,
      usage: completion.usage,
    })
  } catch (error) {
    console.error("[v0] Error in AI generation:", error)
    return Response.json({ error: "Failed to generate content" }, { status: 500 })
  }
}
