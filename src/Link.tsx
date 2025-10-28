import React from "react";

export interface LinkProps {
  href?: string;
  children: React.ReactNode;
  className?: string;
}

export function Link({ href, children, className = "" }: LinkProps) {
  return (
    <a
      href={href}
      className={`${className} text-theme hover:bg-theme hover:text-zinc-800 cursor-pointer transition-all focus:bg-theme focus:text-zinc-800 duration-[0.1s] hover:duration-0`}
    >
      {children}
    </a>
  );
}
