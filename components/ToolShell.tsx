"use client";

import { ReactNode } from "react";

export default function ToolShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="hero-glow">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
