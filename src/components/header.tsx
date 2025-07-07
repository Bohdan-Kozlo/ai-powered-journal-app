import { UserButton } from "@clerk/nextjs";
import { Container } from "@/components/ui/container";
import { MobileSidebar } from "@/components/mobile-sidebar";

export function Header() {
  return (
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
  );
}
