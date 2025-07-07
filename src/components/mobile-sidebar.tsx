"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { BookOpen, Home, LineChart, Settings, User } from "lucide-react";
import Link from "next/link";

type SidebarItemProps = {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
};

function SidebarItem({ icon, label, href, active }: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setOpen(true)}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-3/4 max-w-xs bg-background p-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-semibold">Reflectify</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close menu</span>
              </Button>
            </div>

            <div className="flex flex-col gap-2">
              <SidebarItem
                icon={<Home className="h-5 w-5" />}
                label="Dashboard"
                href="/dashboard"
              />
              <SidebarItem
                icon={<BookOpen className="h-5 w-5" />}
                label="Journal"
                href="/journal"
                active={true}
              />
              <SidebarItem
                icon={<LineChart className="h-5 w-5" />}
                label="Analytics"
                href="/analytics"
              />
              <SidebarItem
                icon={<User className="h-5 w-5" />}
                label="Profile"
                href="/profile"
              />
              <SidebarItem
                icon={<Settings className="h-5 w-5" />}
                label="Settings"
                href="/settings"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
