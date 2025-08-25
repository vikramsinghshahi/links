import type { Metadata, ResolvingMetadata } from 'next';
import Image from 'next/image';
import { getPostBySlug } from '../lib/posts';
import AdSlot from '../components/AdSlot';

export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  if (!post) return { title: 'Not found' };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url: `https://YOUR-DOMAIN.com/${post.slug}`,
      images: [{ url: post.image, width: 1600, height: 900 }],
    },
    twitter: { card: 'summary_large_image' },
    other: { robots: 'max-image-preview:large' },
  };
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) return <div>Not found</div>;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: post.title,
    description: post.excerpt,
    image: [`https://YOUR-DOMAIN.com${post.image}`],
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: [{ '@type': 'Person', name: post.author }],
    mainEntityOfPage: `https://YOUR-DOMAIN.com/${post.slug}`,
    publisher: {
      '@type': 'Organization',
      name: 'Your News Site',
      logo: { '@type': 'ImageObject', url: 'https://YOUR-DOMAIN.com/icon.png' },
    },
  };

  return (
    <article className="prose prose-zinc max-w-none">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <h1 className="mb-2">{post.title}</h1>
      <p className="!mt-0 text-sm text-zinc-500">
        {new Date(post.publishedAt).toLocaleDateString()} • By {post.author}
      </p>

      <div className="relative aspect-[16/9] w-full mb-4">
        <Image
          src={post.image}
          alt={post.title}
          fill
          sizes="100vw"
          className="object-cover rounded-2xl"
          priority
        />
      </div>
      <AdSlot slotId="adslot-1" adSlot="123456789" />
    </article>
  );
}
