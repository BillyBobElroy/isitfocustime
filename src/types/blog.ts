export type BlogPost = {
    title: string;
    slug: string;
    date: string;
    summary: string;
    content: string;
    category: string; // Optional: if you want category filters
    seo?: {
      title?: string;
      description?: string;
    };
  };
  