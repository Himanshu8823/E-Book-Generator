# Advanced Features Guide - Tiptap Pages with AI

## 🎨 Page Customization Features

### Page Settings Panel
Access the **Page Settings** button in the editor toolbar to configure:

#### 1. **Show Page Borders**
- Toggle to show/hide visual borders around each page
- Useful for seeing exact page boundaries during editing

#### 2. **Show Page Numbers**
- Enable/disable page numbers in headers and footers
- Can be toggled independently of other header/footer content

#### 3. **Header Customization**
Configure three-column headers:
- **Left**: Company name, document title, etc.
- **Center**: Section name, chapter title, etc.
- **Right**: Date, author name, etc.

#### 4. **Footer Customization**
Configure three-column footers:
- **Left**: Copyright info, confidential notice, etc.
- **Center**: Additional notes
- **Right**: Page numbers using `{page}` and `{total}` placeholders

### Dynamic Placeholders
Use these in headers/footers:
- `{page}` - Current page number
- `{total}` - Total number of pages

**Example**: "Page {page} of {total}" displays as "Page 1 of 5"

---

## 🤖 AI Editing Capabilities (Tiptap AI Extension)

### Setup Required
1. Go to https://cloud.tiptap.dev/
2. Create an application
3. Get your App ID and API Token
4. Add to `.env`:
   ```env
   NEXT_PUBLIC_TIPTAP_APP_ID=your_app_id
   NEXT_PUBLIC_TIPTAP_API_TOKEN=your_token
   ```

### AI Features Available

#### 1. **AI Text Generation**
- Select text in editor
- AI can continue, expand, or improve selected text
- Automatically integrated with Pages extension

#### 2. **AI Autocompletion**
- Start typing and AI suggests completions
- Press Tab to accept suggestions
- Context-aware based on document type

#### 3. **AI Text Prompt** (Custom Commands)
Use via editor reference:
```typescript
editorRef.current?.aiEdit("Make this paragraph more professional")
editorRef.current?.aiEdit("Expand this section with more details")
editorRef.current?.aiEdit("Simplify this technical explanation")
```

#### 4. **AI Complete**
- Automatically complete current sentence/paragraph
- Based on context and writing style

### AI Commands Available
- `editor.commands.aiTextPrompt(prompt)` - Custom AI editing
- `editor.commands.aiComplete()` - Auto-complete
- `editor.commands.aiImprove()` - Improve selected text
- `editor.commands.aiExpand()` - Expand selection
- `editor.commands.aiSimplify()` - Simplify language
- `editor.commands.aiFixSpelling()` - Fix spelling/grammar

---

## 📊 Export Features

### DOCX Export
- Exports with proper pagination
- Maintains headers and footers
- Preserves all formatting

### PDF Export (via existing functionality)
- Page-based layout preserved
- Professional document appearance

---

## 🎯 Workflow Example

### Professional Document Creation
1. **Setup Page Settings**
   - Add company header
   - Configure page numbers in footer
   - Enable page borders for preview

2. **Write Content**
   - Use AI Assistant for content generation
   - Or use AI autocompletion while typing

3. **AI Editing**
   - Select sections to improve
   - Use AI prompts for specific edits
   - Refine with AI suggestions

4. **Export**
   - Remove page borders
   - Export to DOCX/PDF
   - Professional page-based document ready

---

## 💡 Tips

### Best Practices
- **Headers**: Keep left-aligned content for branding
- **Footers**: Right-align page numbers for professional look
- **AI Prompts**: Be specific for better results
- **Page Borders**: Enable during editing, disable for export

### Common Use Cases
- **Reports**: Header with logo/title, footer with page numbers
- **Books**: Chapter in header, page numbers in footer
- **Legal Docs**: Case number in header, pagination in footer
- **Academic**: Course info in header, page numbers in footer

---

## 🔧 Advanced Configuration

### Custom Page Formats
Modify in `tiptap-editor.tsx`:
```typescript
Pages.configure({
  pageFormat: 'A4', // or 'Letter', 'Legal', custom
  // ... other options
})
```

### AI Model Configuration
The AI extension uses your Tiptap Cloud AI settings:
- Model selection
- Temperature
- Max tokens
- Custom instructions

All configured in the Tiptap Cloud dashboard.
