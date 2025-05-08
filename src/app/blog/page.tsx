import Link from 'next/link';
import { getAllPosts } from '@/lib/blog'; // ✅ import from lib, not from data/blog-posts

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

export default function BlogPage() {
  const posts = getAllPosts(); // ✅ fetch dynamic list from /content/blog

  return (
    <div className="flex flex-col items-center min-h-screen bg-zinc-900 text-white px-4 py-12">
      <div className="max-w-4xl w-full space-y-10">
        <h1 className="text-4xl font-bold mb-10 text-center">isitfocustime Blog</h1>
        <p className="text-white text-base text-center max-w-xl mx-auto">
        Discover expert tips, focus tools, and wellness guides on our blog — designed to boost productivity, mindfulness, and mental clarity through distraction-free, practical insights.
        </p>

        {posts.map((post) => (
          <div key={post.slug} className="bg-zinc-800 p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <Link href={`/blog/${post.slug}`} className="group">
              <h2 className="text-3xl font-bold mb-2 group-hover:text-green-400">{post.title}</h2>
            </Link>
            <div className="flex items-center justify-between text-zinc-400 text-sm mb-4">
              <span>{formatDate(post.date)}</span>
              {post.category && (
                <span className="bg-zinc-700 text-xs px-2 py-1 rounded-lg uppercase">
                  {post.category}
                </span>
              )}
            </div>
            <p className="text-zinc-300 leading-relaxed">{post.summary}</p>
            <div className="mt-4">
              <Link href={`/blog/${post.slug}`}>
                <button className="text-green-400 hover:underline text-sm">Read More →</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}