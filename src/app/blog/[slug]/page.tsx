import { notFound } from 'next/navigation';
import { getPostBySlug, getAllPosts } from '@/lib/blog';
import { Comments } from '@/components/Comments';
import { TOC } from '@/components/TOC';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypeSlug from 'rehype-slug';

// 🛡️ Strong type for dynamic route params
interface BlogPageProps {
  params: {
    slug: string;
  };
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

function calculateReadingTime(text: string) {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// ✅ Static generation support (good!)
export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// ✅ Make BlogPostPage async
export default async function BlogPostPage({ params }: BlogPageProps) {
  if (!params?.slug) notFound(); // 🛡️ Guard

  const slug = decodeURIComponent(params.slug);
  const post = await getPostBySlug(slug);

  if (!post) notFound(); // 🛡️ Guard

  return (
    <div className="flex flex-col items-center min-h-screen bg-zinc-900 text-white px-4 py-12">
      <div className="max-w-3xl w-full">
        <h1 className="text-4xl font-bold mb-4">{post.meta.title}</h1>
        <p className="text-sm text-zinc-400 mb-8">
          {formatDate(post.meta.date)} | {calculateReadingTime(post.content)} min read
        </p>

        <TOC />

        <div className="prose prose-zinc prose-invert max-w-none text-white mb-16">
          <MDXRemote
              source={post.content}
              options={{
              mdxOptions: {
              rehypePlugins: [rehypeSlug], // 👈 Add this
        },
        }}
        />
        </div>

        {post && <Comments slug={post.meta.slug} />}
      </div>
    </div>
  );
}
