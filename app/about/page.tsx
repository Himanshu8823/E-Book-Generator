"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, Target, Eye, Award, Users, Heart, Zap, ArrowRight, Menu, X } from "lucide-react"

export default function AboutPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
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
              <Link href="/">Home</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/auth/login">Sign in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/auth/sign-up">Get Started</Link>
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
                <Link href="/">Home</Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild onClick={() => setMobileMenuOpen(false)}>
                <Link href="/auth/login">Sign in</Link>
              </Button>
              <Button className="w-full" asChild onClick={() => setMobileMenuOpen(false)}>
                <Link href="/auth/sign-up">Get Started</Link>
              </Button>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-bold tracking-tight md:text-6xl">
            About{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Our Platform
            </span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground md:text-xl">
            We're building the future of document creation with AI-powered tools that make professional writing accessible to everyone.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-2">
            <Card className="border-2 border-primary/20">
              <CardContent className="p-8">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h2 className="mb-4 text-2xl font-bold">Our Mission</h2>
                <p className="leading-relaxed text-muted-foreground">
                  To democratize professional writing by providing powerful AI-assisted tools that help researchers, students, 
                  and professionals create high-quality documents faster and more efficiently. We believe everyone deserves 
                  access to cutting-edge writing technology, regardless of their background or budget.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20">
              <CardContent className="p-8">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
                <h2 className="mb-4 text-2xl font-bold">Our Vision</h2>
                <p className="leading-relaxed text-muted-foreground">
                  To become the world's most trusted platform for AI-powered document creation, where writers can focus 
                  on their ideas while we handle the complexity of formatting, structure, and content enhancement. 
                  We envision a future where creating professional documents is as easy as having a conversation.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="bg-accent/30 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-center text-3xl font-bold">Our Story</h2>
            <div className="space-y-6 text-muted-foreground">
              <p className="text-lg leading-relaxed">
                AI E-Book Generator was born from a simple observation: creating professional documents shouldn't 
                require expensive software, years of training, or countless hours of formatting and restructuring. 
                As researchers and writers ourselves, we experienced firsthand the frustration of spending more time 
                on formatting than on actual content creation.
              </p>
              <p className="text-lg leading-relaxed">
                In 2024, we assembled a team of AI engineers, UX designers, and professional writers to build a 
                platform that combines the power of advanced AI models with intuitive, professional-grade editing tools. 
                Our goal was simple: make document creation as natural and efficient as possible.
              </p>
              <p className="text-lg leading-relaxed">
                Today, we're proud to serve thousands of users worldwide – from doctoral students working on dissertations 
                to technical writers creating documentation, from researchers publishing papers to authors writing books. 
                Every day, our platform helps create better documents faster, and we're just getting started.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold">Our Core Values</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="mb-3 text-xl font-semibold">User-Centric</h3>
                <p className="text-sm text-muted-foreground">
                  Every feature we build starts with understanding our users' needs. We listen, iterate, and improve based on real feedback.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Zap className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="mb-3 text-xl font-semibold">Innovation</h3>
                <p className="text-sm text-muted-foreground">
                  We leverage the latest AI technology to push boundaries and create tools that didn't exist before.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Heart className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="mb-3 text-xl font-semibold">Accessibility</h3>
                <p className="text-sm text-muted-foreground">
                  Professional writing tools should be affordable and accessible to everyone, from students to established professionals.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="mb-3 text-xl font-semibold">Quality</h3>
                <p className="text-sm text-muted-foreground">
                  We're committed to delivering high-quality output that meets academic and professional standards.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Target className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="mb-3 text-xl font-semibold">Reliability</h3>
                <p className="text-sm text-muted-foreground">
                  Your work is important. We ensure 99.9% uptime, automatic backups, and secure data storage.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="mb-3 text-xl font-semibold">Continuous Improvement</h3>
                <p className="text-sm text-muted-foreground">
                  We're never satisfied. Every week we ship new features and improvements based on user feedback.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-y border-border bg-primary py-16 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Join Our Growing Community</h2>
          <p className="mb-8 text-lg opacity-90">
            Be part of the future of document creation. Start creating professional documents today.
          </p>
          <Button size="lg" variant="secondary" className="h-12 px-8 text-base" asChild>
            <Link href="/auth/sign-up">
              Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
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
