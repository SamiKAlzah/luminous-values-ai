export type Lang = "ar" | "en";

export const JOURNEY_IDS = [
  "citizenship_shared_facility",
  "tolerance_accent",
  "peace_before_escalation",
] as const;
export type JourneyId = (typeof JOURNEY_IDS)[number];

export const ROUTES = [
  ...JOURNEY_IDS,
  "out_of_scope",
  "refer_specialist",
  "refer_safety",
] as const;
export type Route = (typeof ROUTES)[number];

export type Confidence = "high" | "low";

export type PickerReason =
  | "low_confidence"
  | "out_of_scope"
  | "unavailable"
  | "too_long";

export type RouteResponse =
  | { outcome: "journey"; journeyId: JourneyId }
  | { outcome: "picker"; reason: PickerReason }
  | { outcome: "refer_specialist" }
  | { outcome: "refer_safety" };
