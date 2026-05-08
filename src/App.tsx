import "./i18n";
import { ThemeProvider } from "./theme/ThemeContext";
import { Cursor } from "./components/Cursor";
import { Chrome } from "./components/Chrome";
import { Status } from "./components/Status";
import { ScrollProgress } from "./components/ScrollProgress";
import { Hero } from "./components/Hero";
import { Marquee } from "./components/Marquee";
import { About } from "./components/About";
import { Work } from "./components/Work";
import { Experience } from "./components/Experience";
import { Skills } from "./components/Skills";
import { GitHubTerrain } from "./components/GitHubTerrain";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { useReveal } from "./hooks/useReveal";

export default function App() {
  useReveal();

  return (
    <ThemeProvider>
      <Cursor />
      <Chrome />
      <Status />
      <ScrollProgress />

      <main>
        <Hero />
        <Marquee />
        <About />
        <Work />
        <Experience />
        <Skills />
        <GitHubTerrain />
        <Contact />
      </main>

      <Footer />
    </ThemeProvider>
  );
}
