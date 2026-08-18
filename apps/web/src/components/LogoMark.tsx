type LogoMarkProps = {
  size?: number;
  className?: string;
};

export function LogoMark({ size = 24, className }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="32 17 86 81"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M40 85V55L75 25L110 55V85C110 87.7614 107.761 90 105 90H45C42.2386 90 40 87.7614 40 85Z"
        strokeWidth={6}
      />
      <path
        d="M58 85V62L75 47L92 62V85C92 86.1046 91.1046 87 90 87H60C58.8954 87 58 86.1046 58 85Z"
        strokeWidth={4}
      />
    </svg>
  );
}
