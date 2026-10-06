import type { Metadata } from "next";
import AboutContent from "../../components/AboutContent";
import { UI_COPY } from "../../lib/copy";

export const metadata: Metadata = {
  title: UI_COPY.ar.about.metaTitle,
  description: UI_COPY.ar.about.metaDescription,
};

export default function AboutPage() {
  return <AboutContent />;
}
