import React from "react";
import { cn } from "@/lib/utils";

interface HeroProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function Hero({
  title,
  description,
  children,
  className,
  ...props
}: HeroProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center space-y-8 py-16",
        className
      )}
      {...props}
    >
      <div className="space-y-4 max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          {title}
        </h1>
        {description && (
          <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl">
            {description}
          </p>
        )}
      </div>
      {children && (
        <div className="flex flex-col sm:flex-row gap-4">{children}</div>
      )}
    </div>
  );
}
