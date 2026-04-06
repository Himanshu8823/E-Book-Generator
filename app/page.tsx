"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, BookOpen, FileText, Sparkles, Zap, Star, CheckCircle2, Users, Clock, Download, Menu, X } from "lucide-react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

const testimonials = [
  {
    name: "Dr. Sarah Johnson",
    role: "Research Scientist, MIT",
    content:
      "This platform has completely transformed my research workflow. The AI generates incredibly detailed content that serves as an excellent starting point. I've published three papers this year, and this tool was instrumental in all of them. The time I save on formatting and initial drafts lets me focus on the actual research.",
    rating: 5,
    avatar: "SJ",
    color: "bg-blue-500",
  },
  {
    name: "Michael Chen",
    role: "PhD Student, Stanford University",
    content:
      "As a doctoral student juggling multiple projects, this tool has been a lifesaver. The AI assistant doesn't just generate content—it helps me structure my arguments logically and expand on complex topics. The export to DOCX is flawless, saving me hours of reformatting. Absolutely worth every penny!",
    rating: 5,
    avatar: "MC",
    color: "bg-green-500",
  },
  {
    name: "Prof. Emily Roberts",
    role: "Computer Science Professor, Berkeley",
    content:
      "I recommend this to all my graduate students. It's not just an AI writing tool—it's a comprehensive research platform. The template library alone has accelerated our department's publication process by 40%. The quality of AI-generated content is consistently impressive, and the editing interface rivals expensive alternatives.",
    rating: 5,
    avatar: "ER",
    color: "bg-purple-500",
  },
  {
    name: "David Martinez",
    role: "Technical Writer, Google",
    content:
      "I've tried every documentation tool out there, and this is by far the best for technical writing. The code formatting is perfect, the export functionality is seamless, and the AI understands technical concepts surprisingly well. My team now uses this exclusively for all internal documentation.",
    rating: 5,
    avatar: "DM",
    color: "bg-orange-500",
  },
  {
    name: "Dr. Priya Sharma",
    role: "Medical Researcher, Johns Hopkins",
    content:
      "Writing case studies and research papers used to take weeks. Now, with AI assistance, I complete comprehensive drafts in days. The platform understands medical terminology and maintains academic rigor. It's like having a research assistant available 24/7. Game-changing for medical professionals.",
    rating: 5,
    avatar: "PS",
    color: "bg-pink-500",
  },
  {
    name: "James Wilson",
    role: "Bestselling Author",
    content:
      "I was skeptical about using AI for creative writing, but this tool changed my mind. It doesn't replace creativity—it enhances it. When I hit writer's block, the AI helps me explore new directions. I finished my latest novel 3 months ahead of schedule. Every writer should try this.",
    rating: 5,
    avatar: "JW",
    color: "bg-indigo-500",
  },
]

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Content Generation",
    description:
      "Generate high-quality, detailed content using advanced AI models. Create entire chapters, sections, and comprehensive documents in minutes with intelligent content suggestions.",
    image: "/ai-artificial-intelligence-brain-technology-futuri.jpg",
  },
  {
    icon: FileText,
    title: "Professional Rich Text Editor",
    description:
      "Advanced editing experience with complete formatting options including fonts, sizes, colors, tables, images, and code blocks. Everything you need for academic and technical writing.",
    image: "/professional-document-editor-writing-workspace-lap.jpg",
  },
  {
    icon: BookOpen,
    title: "Multiple Export Formats",
    description:
      "Export your documents to PDF, DOCX, Markdown, and HTML. Perfect for research papers, e-books, dissertations, and technical documentation with professional formatting preserved.",
    image: "/documents-files-export-formats-pdf-word-paper-stac.jpg",
  },
  {
    icon: Zap,
    title: "Instant Template Library",
    description:
      "Start quickly with pre-built templates for research papers, project reports, e-books, case studies, and more. Customizable to fit your specific needs.",
    image: "/template-library-document-templates-organized-fold.jpg",
  },
  {
    icon: Users,
    title: "Collaborative Features",
    description:
      "Manage multiple documents, track versions, and organize your work efficiently. Perfect for academic researchers, students, and professional writers.",
    image: "/team-collaboration-people-working-together-office.jpg",
  },
  {
    icon: Clock,
    title: "Auto-Save & Cloud Sync",
    description:
      "Never lose your work with automatic saving every 30 seconds. Access your documents from anywhere with secure cloud synchronization.",
    image: "/cloud-storage-sync-backup-technology-data-protecti.jpg",
  },
]

const stats = [
  { label: "Documents Created", value: "50,000+" },
  { label: "Active Users", value: "10,000+" },
  { label: "Words Generated", value: "100M+" },
  { label: "Average Rating", value: "4.9/5" },
]

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-base sm:text-xl font-bold text-foreground">AI E-Book Generator</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2 lg:gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/about">About</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/auth/login">Sign in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/auth/sign-up">Get Started Free</Link>
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-accent rounded-md transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-white">
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
              <Button variant="ghost" className="w-full justify-start" asChild onClick={() => setMobileMenuOpen(false)}>
                <Link href="/about">About</Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild onClick={() => setMobileMenuOpen(false)}>
                <Link href="/auth/login">Sign in</Link>
              </Button>
              <Button className="w-full" asChild onClick={() => setMobileMenuOpen(false)}>
                <Link href="/auth/sign-up">Get Started Free</Link>
              </Button>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="hero-title text-balance text-5xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl">
            Create Professional Documents{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              10x Faster with AI
            </span>
          </h1>
          <p className="hero-description mt-6 text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
            Transform your ideas into research papers, e-books, dissertations, and technical documentation with AI-powered assistance. 
            Professional editing tools, intelligent content generation, and seamless export to multiple formats—all in one platform. 
            Trusted by 10,000+ researchers, students, and writers worldwide.
          </p>
          <div className="hero-buttons mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="h-12 px-8 text-base" asChild>
              <Link href="/auth/sign-up">
                Start Writing Free <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base bg-transparent" asChild>
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            ✓ No credit card required • ✓ Free tier available • ✓ Cancel anytime
          </p>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="border-y border-border bg-gradient-to-b from-accent/30 to-background py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="mb-3 text-4xl font-bold">Loved by Professionals Worldwide</h2>
              <p className="text-lg text-muted-foreground">
                Join thousands of researchers, writers, and students who trust our platform
              </p>
            </div>
            <div className="relative px-8 sm:px-12">
              <Carousel className="w-full">
                <CarouselContent>
                  {testimonials.map((testimonial, index) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                      <Card className="h-full border-2 hover:border-primary/50 transition-all hover:shadow-xl">
                        <CardContent className="flex h-full flex-col p-6">
                        <div className="mb-4 flex items-center justify-between">
                          <div className="flex">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                          <div className="text-xs font-semibold text-primary">VERIFIED</div>
                        </div>
                        <p className="mb-6 flex-1 text-sm leading-relaxed text-foreground">
                          "{testimonial.content}"
                        </p>
                        <div className="flex items-center gap-3 border-t pt-4">
                          <div className={`flex h-12 w-12 items-center justify-center rounded-full ${testimonial.color} text-white font-bold text-sm`}>
                            {testimonial.avatar}
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{testimonial.name}</p>
                            <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-4 sm:-left-6" />
              <CarouselNext className="-right-4 sm:-right-6" />
            </Carousel>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item text-center">
                <div className="text-4xl font-bold text-primary">{stat.value}</div>
                <div className="mt-2 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold md:text-5xl">Powerful Features for Every Writer</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              From AI-powered content generation to professional formatting and export options, we provide all the tools you need to create outstanding documents efficiently.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="feature-card overflow-hidden border-border transition-all hover:shadow-lg">
                  <div className="relative h-48 w-full overflow-hidden bg-accent">
                    <img
                      src={feature.image || "/placeholder.svg"}
                      alt={feature.title}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 inline-flex rounded-lg bg-white/90 p-3 shadow-lg">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="mb-3 text-xl font-semibold">{feature.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-accent/30 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-12 text-center text-3xl font-bold">How It Works</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  1
                </div>
                <h3 className="mb-2 text-lg font-semibold">Choose a Template</h3>
                <p className="text-sm text-muted-foreground">
                  Select from our library of professional templates or start from scratch
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  2
                </div>
                <h3 className="mb-2 text-lg font-semibold">Generate Content with AI</h3>
                <p className="text-sm text-muted-foreground">
                  Use AI to generate detailed content or write manually with advanced editing tools
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  3
                </div>
                <h3 className="mb-2 text-lg font-semibold">Export & Share</h3>
                <p className="text-sm text-muted-foreground">
                  Export to PDF, DOCX, or HTML with professional formatting preserved
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold">Why Choose Our Platform?</h2>
              <ul className="space-y-4">
                {[
                  "AI-powered content generation saves hours of writing time",
                  "Professional editing tools rival expensive word processors",
                  "Cloud-based with automatic saving - never lose your work",
                  "Export to multiple formats with one click",
                  "Template library for quick starts on any project type",
                  "Affordable pricing for students and professionals",
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center justify-center">
              <Card className="w-full border-2 border-primary/20">
                <CardContent className="p-8">
                  <div className="mb-4 text-center">
                    <Download className="mx-auto h-12 w-12 text-primary" />
                  </div>
                  <h3 className="mb-2 text-center text-2xl font-bold">Start for Free</h3>
                  <p className="mb-6 text-center text-sm text-muted-foreground">
                    No credit card required. Full access to all features.
                  </p>
                  <Button className="w-full" size="lg" asChild>
                    <Link href="/auth/sign-up">Create Account</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-y border-border bg-primary py-16 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Ready to Transform Your Writing?</h2>
          <p className="mb-8 text-lg opacity-90">
            Join thousands of researchers, students, and writers using AI to create better documents faster
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" variant="secondary" className="h-12 px-8 text-base" asChild>
              <Link href="/auth/sign-up">
                Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="font-semibold">AI E-Book Generator</span>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              &copy; 2025 AI E-Book Generator. Powered by Groq AI.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
