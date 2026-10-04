export interface Approval {
  status: "draft" | "approved";
  reviewedBy: string;
  reviewedAt: string;
  version: number;
  contentHash: string;
}

export interface SourceCheck {
  checkedAt: string;
  url: string;
  arabicTextHash: string;
  pass: boolean;
}

export interface ContentFile<B> {
  id: string;
  approval: Approval;
  body: B;
  sourceCheck?: SourceCheck;
}

export interface Choice {
  text: string;
  feedback: string;
}

export interface JourneyText {
  title: string;
  situation: string;
  firstChoices: Choice[];
  solutionSteps: string[];
  newSituation: string;
  newChoices: Choice[];
  todayStep: string;
  activityLabel: string;
}

export interface Source {
  type: "quran" | "hadith";
  arabicText: string;
  reference: string;
  grade: string;
  url: string;
  translation: { name: string; text: string };
  explanation: { ar: string; en: string };
}

export interface JourneyBody {
  ar: JourneyText;
  en: JourneyText;
  source: Source;
}

export type MessageKey =
  | "low_confidence"
  | "out_of_scope"
  | "unavailable"
  | "too_long"
  | "refer_specialist"
  | "refer_safety";

export type MessagesBody = Record<MessageKey, { ar: string; en: string }>;

export interface FloorBody {
  phrases: { ar: string[]; en: string[] };
}
