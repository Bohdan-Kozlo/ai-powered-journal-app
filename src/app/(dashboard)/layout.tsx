import { UserButton } from "@clerk/nextjs";
import { Container } from "@/components/ui/container";
import { MobileSidebar } from "@/components/mobile-sidebar";
import { BookOpen, Home, LineChart, User } from "lucide-react";
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

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background">
        <Container>
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <MobileSidebar />
              <div className="font-semibold">Reflectify</div>
            </div>
            <div className="flex items-center gap-4">
              <UserButton />
            </div>
          </div>
        </Container>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r md:block">
          <div className="flex h-full flex-col gap-2 p-4">
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
              href="/user-profile"
            />
          </div>
        </aside>

        {/* Main content */}
        {children}
      </div>
    </div>
  );
}
