import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'src/content/blog');

// === Types ===
export type BlogPostMeta = {
  title: string;
  slug: string;
  date: string;
  summary: string;
  category: string;
  seo?: {
    title?: string;
    description?: string;
  };
};

export type BlogPost = {
  meta: BlogPostMeta;
  content: string;
};

// === Fetch all post metadata (for listing) ===
export function getAllPosts(): BlogPostMeta[] {
  const files = fs.readdirSync(postsDirectory);

  return files
    .filter((file) => file.endsWith('.mdx')) // Only .mdx files
    .map((filename) => {
      const filePath = path.join(postsDirectory, filename);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContents);

      return {
        title: data.title,
        slug: data.slug,
        date: data.date,
        summary: data.summary,
        category: data.category,
        seo: {
          title: data.seo?.title || data.title,
          description: data.seo?.description || data.summary,
        },
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Newest first
}

// === Fetch full post content by slug (for [slug]/page.tsx) ===
export function getPostBySlug(slug: string): BlogPost | null {
  if (!slug) return null; // 🛡️ No slug provided

  const fullPath = path.join(postsDirectory, `${slug}.mdx`);

  if (!fs.existsSync(fullPath)) {
    return null; // 🛡️ No file found, return null
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    meta: {
      title: data.title,
      slug: data.slug,
      date: data.date,
      summary: data.summary,
      category: data.category,
      seo: {
        title: data.seo?.title || data.title,
        description: data.seo?.description || data.summary,
      },
    },
    content,
  };
}
