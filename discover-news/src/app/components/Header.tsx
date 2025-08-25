import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white/70 border-b border-zinc-200">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link href="/" className="text-lg sm:text-xl font-bold">
          Your News Site
        </Link>
        <nav className="text-sm text-zinc-600 flex gap-4">
          <Link href="/">Home</Link>
          <a href="#" className="opacity-60 pointer-events-none">
            World
          </a>
          <a href="#" className="opacity-60 pointer-events-none">
            Tech
          </a>
        </nav>
      </div>
    </header>
  );
}
