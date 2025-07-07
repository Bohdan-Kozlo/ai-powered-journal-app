"use client";

import { BookOpen, Home, LineChart, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

export function Sidebar() {
  const pathname = usePathname();

  const routes = [
    {
      icon: <Home className="h-5 w-5" />,
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      icon: <BookOpen className="h-5 w-5" />,
      label: "Journal",
      href: "/journal",
    },
    {
      icon: <LineChart className="h-5 w-5" />,
      label: "Analytics",
      href: "/analytics",
    },
    {
      icon: <User className="h-5 w-5" />,
      label: "Profile",
      href: "/user-profile",
    },
  ];

  return (
    <aside className="hidden w-64 shrink-0 border-r md:block">
      <div className="flex h-full flex-col gap-2 p-4">
        {routes.map((route) => (
          <SidebarItem
            key={route.href}
            icon={route.icon}
            label={route.label}
            href={route.href}
            active={pathname.includes(route.href)}
          />
        ))}
      </div>
    </aside>
  );
}
