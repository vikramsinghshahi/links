export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  content: string;
};

export const allPosts = (): Post[] => [
  {
    slug: 'explained-why-passports-have-four-colors',
    title:
      'Explained: Why Indian passports come in four colors and who gets them',
    excerpt:
      'A quick guide to ordinary, diplomatic, official, and special category passports—and what each color means.',
    image: '/images/passport-colors.jpg',
    author: 'Your Name',
    publishedAt: '2025-08-23T05:00:00.000Z',
    content: `India issues different passport types: ordinary (navy blue), diplomatic (maroon), official (white/now discontinued for most), and special categories (orange was proposed and rolled back). Colors indicate status`,
  },
  {
    slug: 'explained-why-passports-have-four-colors1',
    title:
      'Explained: Why Indian passports come in four colors and who gets them',
    excerpt:
      'A quick guide to ordinary, diplomatic, official, and special category passports—and what each color means.',
    image: '/images/passport-colors.jpg',
    author: 'Your Name',
    publishedAt: '2025-08-23T05:00:00.000Z',
    content: `India issues different passport types: ordinary (navy blue), diplomatic (maroon), official (white/now discontinued for most), and special categories (orange was proposed and rolled back). Colors indicate status`,
  },
  {
    slug: 'explained-why-passports-have-four-colors2',
    title:
      'Explained: Why Indian passports come in four colors and who gets them',
    excerpt:
      'A quick guide to ordinary, diplomatic, official, and special category passports—and what each color means.',
    image: '/images/passport-colors.jpg',
    author: 'Your Name',
    publishedAt: '2025-08-23T05:00:00.000Z',
    content: `India issues different passport types: ordinary (navy blue), diplomatic (maroon), official (white/now discontinued for most), and special categories (orange was proposed and rolled back). Colors indicate status`,
  },
  {
    slug: 'explained-why-passports-have-four-colors3',
    title:
      'Explained: Why Indian passports come in four colors and who gets them',
    excerpt:
      'A quick guide to ordinary, diplomatic, official, and special category passports—and what each color means.',
    image: '/images/passport-colors.jpg',
    author: 'Your Name',
    publishedAt: '2025-08-23T05:00:00.000Z',
    content: `India issues different passport types: ordinary (navy blue), diplomatic (maroon), official (white/now discontinued for most), and special categories (orange was proposed and rolled back). Colors indicate status`,
  },
];

export const getPostBySlug = (slug: string): Post | undefined => {
  return allPosts().find((post) => post.slug === slug);
};
