interface IconProps {
  link: string;
  className?: string;
}

export function Icon({ link, className }: IconProps) {
  return (
    <svg className={className}>
      <use href={link} />
    </svg>
  );
}
