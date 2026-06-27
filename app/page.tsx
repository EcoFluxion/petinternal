import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import { TrustStrip } from "@/components/trust-strip";
import { Services } from "@/components/services";
import { About } from "@/components/about";
import { Blog } from "@/components/blog";
import { Testimonials } from "@/components/testimonials";
import { CtaBand } from "@/components/cta-band";
import { Contact } from "@/components/contact";
import { SiteFooter } from "@/components/site-footer";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <Hero />
        <TrustStrip />
        <Services />
        <About />
        <Blog />
        <Testimonials />
        <CtaBand />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
