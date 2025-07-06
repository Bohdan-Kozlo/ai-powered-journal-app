import Link from "next/link";

export default function HomeNav() {
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="text-primary font-bold">Reflectify</span>
        </Link>
        <nav className="flex items-center ml-auto gap-4">
          <Link href="/sign-in" className="text-sm hover:underline">
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
          >
            Sign up
          </Link>
        </nav>
      </div>
    </header>
  );
}
