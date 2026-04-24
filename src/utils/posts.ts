export interface Post {
  title: string;
  description: string;
  slug: string;
  date: string;
  tags: string[];
  author: string;
  content: string;
}

// Simple browser-compatible frontmatter parser to avoid Buffer issues with gray-matter
function parseFrontmatter(rawContent: string) {
  const regex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
  const match = rawContent.match(regex);

  if (!match) {
    return { data: {} as any, body: rawContent };
  }

  const yamlBlock = match[1];
  const body = match[2];
  const data: any = {};

  const lines = yamlBlock.split('\n');
  lines.forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > -1) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();

      // Basic YAML parsing for strings and arrays
      if (value.startsWith('[') && value.endsWith(']')) {
        // Parse array: ['A', 'B'] -> ["A", "B"]
        data[key] = value
          .slice(1, -1)
          .split(',')
          .map(item => item.trim().replace(/^["']|["']$/g, ''));
      } else {
        // Parse string: "Value" -> Value
        data[key] = value.replace(/^["']|["']$/g, '');
      }
    }
  });

  return { data, body };
}

const rawPosts = import.meta.glob('../../posts/*.md', { query: '?raw', eager: true }) as Record<string, any>;

export const getAllPosts = (): Post[] => {
  return Object.keys(rawPosts).map((path) => {
    const rawContent = rawPosts[path].default || rawPosts[path];
    const { data, body } = parseFrontmatter(rawContent);
    
    return {
      title: data.title || 'Untitled',
      description: data.description || '',
      slug: data.slug || path.split('/').pop()?.replace('.md', '') || '',
      date: data.date || '',
      tags: data.tags || [],
      author: data.author || 'Unknown Author',
      content: body,
    } as Post;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const getPostBySlug = (slug: string): Post | undefined => {
  const posts = getAllPosts();
  return posts.find((post) => post.slug === slug);
};
