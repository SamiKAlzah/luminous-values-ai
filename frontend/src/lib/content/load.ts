import citizenship from "../../../content/journeys/citizenship_shared_facility.json";
import tolerance from "../../../content/journeys/tolerance_accent.json";
import peace from "../../../content/journeys/peace_before_escalation.json";
import messages from "../../../content/messages.json";
import { JOURNEY_IDS, type JourneyId } from "../types";
import type { ContentFile, JourneyBody, MessagesBody } from "./schema";

const JOURNEYS: Record<JourneyId, ContentFile<JourneyBody>> = {
  citizenship_shared_facility: citizenship as unknown as ContentFile<JourneyBody>,
  tolerance_accent: tolerance as unknown as ContentFile<JourneyBody>,
  peace_before_escalation: peace as unknown as ContentFile<JourneyBody>,
};

export function getJourney(id: JourneyId): ContentFile<JourneyBody> {
  return JOURNEYS[id];
}

export const MESSAGES = messages as unknown as ContentFile<MessagesBody>;

export const JOURNEY_LIST: ContentFile<JourneyBody>[] = JOURNEY_IDS.map(getJourney);
