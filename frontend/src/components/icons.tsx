import {
  Briefcase,
  GraduationCap,
  Globe,
  HandHeart,
  HeartHandshake,
  House,
  Landmark,
  Leaf,
  MessagesSquare,
  type LucideIcon,
} from "lucide-react";

/*
 * Line icons for the interface (1.5px stroke, rounded caps, 24px grid).
 * The datasets still carry emoji in `icon`; the UI ignores them and looks the
 * icon up here by id, so the data files stay unchanged.
 */

export const VALUE_ICONS: Record<string, LucideIcon> = {
  citizenship: Landmark,
  volunteering: HeartHandshake,
  tolerance: HandHeart,
  dialogue: MessagesSquare,
  peace: Leaf,
};

export const ENVIRONMENT_ICONS: Record<string, LucideIcon> = {
  home: House,
  school: GraduationCap,
  workplace: Briefcase,
  digital: Globe,
};
