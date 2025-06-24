import type { RatingIconEntry } from "../../types/movie";

const ratingIcons: RatingIconEntry[] = [
  { threshold: 8, iconClass: "bi bi-emoji-grin", ariaLabel: "Very Positive" },
  { threshold: 6, iconClass: "bi bi-emoji-smile", ariaLabel: "Positive" },
  { threshold: 4, iconClass: "bi bi-emoji-neutral", ariaLabel: "Neutral" },
  { threshold: 2, iconClass: "bi bi-emoji-frown", ariaLabel: "Negative" },
  {
    threshold: 0,
    iconClass: "bi bi-emoji-grimace",
    ariaLabel: "Very Negative",
  },
];

type Props = {
  val: number;
  className?: string;
};

export default function RatingIcon({ val, className = "" }: Props) {
  const entry = ratingIcons.find((e) => val >= e.threshold)!;
  return (
    <i
      className={`${entry.iconClass} ${className}`}
      aria-label={entry.ariaLabel}
    />
  );
}
