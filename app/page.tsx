import Hero from "@/components/hero"
import About from "@/components/about"
import Projects from "@/components/projects"
import Journey from "@/components/journey"
import Personal from "@/components/personal"
import Contact from "@/components/contact"
import Navigation from "@/components/navigation"
import ThemeToggle from "@/components/theme-toggle"

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-background to-background/50">
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>
      <Navigation />
      <Hero />
      <About />
      <Projects />
      <Journey />
      <Personal />
      <Contact />
    </main>
  )
}

