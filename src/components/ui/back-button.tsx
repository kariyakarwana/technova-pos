"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BackButtonProps {
  href?: string;
  label?: string;
  onClick?: () => void;
  className?: string;
}

export function BackButton({
  href,
  label = "Back",
  onClick,
  className,
}: BackButtonProps) {
  const router = useRouter();

  const baseStyles = cn(
    "inline-flex items-center gap-2 rounded-lg border border-[#0E9384] bg-white h-9 px-4 text-xs sm:text-sm font-semibold text-[#0E9384] shadow-2xs transition-colors hover:bg-[#EEFFFD] hover:text-[#0E9384] cursor-pointer",
    className
  );

  const content = (
    <>
      <ArrowLeft className="h-4 w-4 shrink-0" />
      <span>{label}</span>
    </>
  );

  if (href && !onClick) {
    return (
      <Link href={href} className={baseStyles}>
        {content}
      </Link>
    );
  }

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <button type="button" onClick={handleClick} className={baseStyles}>
      {content}
    </button>
  );
}

export default BackButton;
