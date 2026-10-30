import { brandIcons, type BrandName } from "./brand-icons";

type BrandIconProps = {
  name: BrandName;
  className?: string;
};

export default function BrandIcon({
  name,
  className = "h-4 w-4",
}: BrandIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d={brandIcons[name]} />
    </svg>
  );
}
