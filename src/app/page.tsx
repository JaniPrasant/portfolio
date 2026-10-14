import { Hero } from "@/components/sections/hero";
import { Marquee } from "@/components/sections/marquee";
import { About } from "@/components/sections/about";
import { Projects } from "@/components/sections/projects";
import { Clients } from "@/components/sections/clients";
import { Strengths } from "@/components/sections/strengths";
import { Experience } from "@/components/sections/experience";
import { Skills } from "@/components/sections/skills";
import { Education } from "@/components/sections/education";
import { Faq } from "@/components/sections/faq";
import { Contact } from "@/components/sections/contact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <About />
      <Strengths />
      <Clients />
      <Projects />
      <Experience />
      <Skills />
      <Education />
      <Faq />
      <Contact />
    </>
  );
}
