import type { Metadata } from "next";
import AboutUsContent from "../../components/AboutUsContent";
import { UI_COPY } from "../../lib/copy";

export const metadata: Metadata = {
  title: UI_COPY.ar.aboutUs.metaTitle,
  description: UI_COPY.ar.aboutUs.metaDescription,
};

export default function AboutUsPage() {
  return <AboutUsContent />;
}
