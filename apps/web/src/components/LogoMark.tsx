type LogoMarkProps = {
  size?: number;
  className?: string;
};

export function LogoMark({ size = 24, className }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 11L12 4L20 11" />
      <path d="M6 11V20a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V11" />
      <path d="M10 21V15h4v6" />
    </svg>
  );
}
