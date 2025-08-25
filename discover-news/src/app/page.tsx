import Image from 'next/image';
import Link from 'next/link';
import { allPosts } from '../app/lib/posts';
import ArticleCard from '../app/components/Article';

export default function HomePage() {
  const posts = allPosts();
  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-zinc-50 p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Top Stories</h1>
        <p className="text-zinc-600 mt-1">Explainers, world news, and more.</p>
      </section>

      <div className="grid gap-6">
        {posts.map((p) => (
          <ArticleCard key={p.slug} post={p} />
        ))}
      </div>
    </div>
  );
}
