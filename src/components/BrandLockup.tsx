import Image from "next/image";

interface BrandLockupProps {
  tone?: "light" | "dark";
  markSize?: number;
  hideWordmarkOnMobile?: boolean;
  className?: string;
  wordmarkClassName?: string;
}

export function BrandLockup({
  tone = "light",
  markSize = 32,
  hideWordmarkOnMobile = false,
  className = "",
  wordmarkClassName = "",
}: BrandLockupProps) {
  const wordmarkTone = tone === "dark" ? "text-s2" : "text-p2";

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Image
        src="/assets/tws-icons/tws-icon-official-square.png"
        alt=""
        width={markSize}
        height={markSize}
        className="shrink-0 object-contain"
      />
      <span
        className={`${hideWordmarkOnMobile ? "hidden sm:inline" : ""} font-serif-en font-light tracking-[0.24em] uppercase leading-none ${wordmarkTone} ${wordmarkClassName}`}
      >
        THE WAN STANDARD
      </span>
    </span>
  );
}
