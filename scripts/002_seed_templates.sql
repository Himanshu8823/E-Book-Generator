-- Insert default templates
INSERT INTO public.templates (name, description, document_type, content, is_public, created_by) VALUES
(
  'Academic Research Paper',
  'Standard template for academic research papers with sections for abstract, introduction, methodology, results, and conclusions.',
  'research-paper',
  '{"sections": [
    {"type": "heading", "attrs": {"level": 1}, "content": [{"type": "text", "text": "Title"}]},
    {"type": "heading", "attrs": {"level": 2}, "content": [{"type": "text", "text": "Abstract"}]},
    {"type": "paragraph", "content": [{"type": "text", "text": "Write your abstract here..."}]},
    {"type": "heading", "attrs": {"level": 2}, "content": [{"type": "text", "text": "Introduction"}]},
    {"type": "paragraph", "content": [{"type": "text", "text": "Introduction content..."}]},
    {"type": "heading", "attrs": {"level": 2}, "content": [{"type": "text", "text": "Methodology"}]},
    {"type": "paragraph", "content": [{"type": "text", "text": "Methodology content..."}]},
    {"type": "heading", "attrs": {"level": 2}, "content": [{"type": "text", "text": "Results"}]},
    {"type": "paragraph", "content": [{"type": "text", "text": "Results content..."}]},
    {"type": "heading", "attrs": {"level": 2}, "content": [{"type": "text", "text": "Conclusion"}]},
    {"type": "paragraph", "content": [{"type": "text", "text": "Conclusion content..."}]}
  ]}',
  true,
  NULL
),
(
  'E-Book Chapter',
  'Template for e-book chapters with sections for chapter title, introduction, main content, and summary.',
  'ebook',
  '{"sections": [
    {"type": "heading", "attrs": {"level": 1}, "content": [{"type": "text", "text": "Chapter Title"}]},
    {"type": "paragraph", "content": [{"type": "text", "text": "Chapter introduction..."}]},
    {"type": "heading", "attrs": {"level": 2}, "content": [{"type": "text", "text": "Section 1"}]},
    {"type": "paragraph", "content": [{"type": "text", "text": "Content here..."}]},
    {"type": "heading", "attrs": {"level": 2}, "content": [{"type": "text", "text": "Section 2"}]},
    {"type": "paragraph", "content": [{"type": "text", "text": "Content here..."}]},
    {"type": "heading", "attrs": {"level": 2}, "content": [{"type": "text", "text": "Summary"}]},
    {"type": "paragraph", "content": [{"type": "text", "text": "Chapter summary..."}]}
  ]}',
  true,
  NULL
),
(
  'Technical Documentation',
  'Template for technical documentation with sections for overview, requirements, implementation, and API reference.',
  'technical-doc',
  '{"sections": [
    {"type": "heading", "attrs": {"level": 1}, "content": [{"type": "text", "text": "Project Documentation"}]},
    {"type": "heading", "attrs": {"level": 2}, "content": [{"type": "text", "text": "Overview"}]},
    {"type": "paragraph", "content": [{"type": "text", "text": "Project overview..."}]},
    {"type": "heading", "attrs": {"level": 2}, "content": [{"type": "text", "text": "Requirements"}]},
    {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Requirement 1"}]}]}]},
    {"type": "heading", "attrs": {"level": 2}, "content": [{"type": "text", "text": "Implementation"}]},
    {"type": "paragraph", "content": [{"type": "text", "text": "Implementation details..."}]},
    {"type": "heading", "attrs": {"level": 2}, "content": [{"type": "text", "text": "API Reference"}]},
    {"type": "paragraph", "content": [{"type": "text", "text": "API documentation..."}]}
  ]}',
  true,
  NULL
),
(
  'Project Report',
  'Comprehensive template for project reports with executive summary, objectives, findings, and recommendations.',
  'project-report',
  '{"sections": [
    {"type": "heading", "attrs": {"level": 1}, "content": [{"type": "text", "text": "Project Report"}]},
    {"type": "heading", "attrs": {"level": 2}, "content": [{"type": "text", "text": "Executive Summary"}]},
    {"type": "paragraph", "content": [{"type": "text", "text": "Executive summary..."}]},
    {"type": "heading", "attrs": {"level": 2}, "content": [{"type": "text", "text": "Project Objectives"}]},
    {"type": "paragraph", "content": [{"type": "text", "text": "Objectives..."}]},
    {"type": "heading", "attrs": {"level": 2}, "content": [{"type": "text", "text": "Key Findings"}]},
    {"type": "paragraph", "content": [{"type": "text", "text": "Findings..."}]},
    {"type": "heading", "attrs": {"level": 2}, "content": [{"type": "text", "text": "Recommendations"}]},
    {"type": "paragraph", "content": [{"type": "text", "text": "Recommendations..."}]}
  ]}',
  true,
  NULL
);
