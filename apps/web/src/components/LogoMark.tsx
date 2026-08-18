type LogoMarkProps = {
  size?: number;
  className?: string;
};

export function LogoMark({ size = 24, className }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      stroke="currentColor"
      strokeWidth={14}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M88.4,27 Q100,16 112.4,26.1 L171.6,73.9 Q184,84 184,100 L184,140 Q184,156 168,156 L44,156 Q28,156 28,140 L28,100 Q28,84 39.6,73 Z" />
      <path d="M122.1,56.75 Q133,48 143.9,56.75 L177.1,83.25 Q188,92 188,106 L188,125 Q188,139 174,139 L92,139 Q78,139 78,125 L78,106 Q78,92 88.9,83.25 Z" />
    </svg>
  );
}
