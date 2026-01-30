import { cn } from "@/lib/utils";

interface SoccerBallProps {
  className?: string;
  size?: number;
}

export function SoccerBall({ className, size = 24 }: SoccerBallProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-foreground", className)}
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
      <path
        d="M12 2L12 6M12 18L12 22M2 12L6 12M18 12L22 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M12 7L14.5 9L13.5 12L10.5 12L9.5 9L12 7Z"
        fill="currentColor"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  );
}
