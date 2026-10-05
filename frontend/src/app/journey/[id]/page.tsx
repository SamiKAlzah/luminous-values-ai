import { notFound } from "next/navigation";
import JourneyPlayer from "../../../components/JourneyPlayer";
import { JOURNEY_IDS, type JourneyId } from "../../../lib/types";

// Exactly the three reviewed journeys are generated; any other id is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return JOURNEY_IDS.map((id) => ({ id }));
}

export default async function JourneyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!(JOURNEY_IDS as readonly string[]).includes(id)) notFound();
  return <JourneyPlayer id={id as JourneyId} />;
}
