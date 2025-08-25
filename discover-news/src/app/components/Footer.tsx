export default function Footer() {
  return (
    <footer className="mt-10 border-t border-zinc-200">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8 text-xs text-zinc-500">
        © {new Date().getFullYear()} Your News Site • Built with Next.js •{' '}
        <a className="underline" href="/sitemap.xml">
          Sitemap
        </a>
      </div>
    </footer>
  );
}
