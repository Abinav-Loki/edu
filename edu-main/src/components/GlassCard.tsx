import type { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  as?: "div" | "article" | "section";
  padding?: "sm" | "md" | "lg" | "none";
  onClick?: () => void;
  role?: string;
  "aria-label"?: string;
}

const paddingMap = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

export default function GlassCard({
  children,
  className = "",
  hover = false,
  as: Tag = "div",
  padding = "md",
  onClick,
  role,
  "aria-label": ariaLabel,
}: GlassCardProps) {
  return (
    <Tag
      className={`glass-card ${hover ? "card-hover cursor-pointer" : ""} ${paddingMap[padding]} ${className}`}
      onClick={onClick}
      role={role}
      aria-label={ariaLabel}
    >
      {children}
    </Tag>
  );
}
