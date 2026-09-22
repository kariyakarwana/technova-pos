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
  iconClassName?: string;
  size?: "sm" | "default" | "lg";
}

const sizeClasses = {
  sm: "h-8 px-3.5 text-xs gap-1.5 shadow-xs",
  default: "h-8 px-3.5 text-xs gap-1.5 shadow-xs",
  lg: "h-10 px-4 text-sm gap-2 shadow-xs",
};

const iconSizeClasses = {
  sm: "h-3.5 w-3.5",
  default: "h-3.5 w-3.5",
  lg: "h-4 w-4",
};

export function BackButton({
  href,
  label = "Back",
  onClick,
  className,
  iconClassName,
  size = "sm",
}: BackButtonProps) {
  const router = useRouter();

  const baseStyles = cn(
    "inline-flex items-center justify-center font-semibold rounded-lg border border-[#0E9384] bg-white text-[#0E9384] transition-colors hover:bg-[#EEFFFD] hover:text-[#0E9384] cursor-pointer",
    sizeClasses[size],
    className
  );

  const content = (
    <>
      <ArrowLeft className={cn(iconSizeClasses[size], "shrink-0", iconClassName)} />
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
