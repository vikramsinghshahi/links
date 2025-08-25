import Image from 'next/image';
import Link from 'next/link';

export default function ArticleCard({ post }: { post: any }) {
  return (
    <article className="rounded-2xl overflow-hidden border border-zinc-200 hover:shadow-sm transition">
      <Link href={`/${post.slug}`} className="block">
        <div className="relative aspect-[16/9] w-full">
          <Image
            src={post.image}
            alt={post.title}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <h2 className="text-lg sm:text-xl font-semibold leading-snug">
            {post.title}
          </h2>
          <p className="text-zinc-600 text-sm mt-1 line-clamp-2">
            {post.excerpt}
          </p>
          <p className="text-zinc-400 text-xs mt-2">
            {new Date(post.publishedAt).toLocaleDateString()} • {post.author}
          </p>
        </div>
      </Link>
    </article>
  );
}
