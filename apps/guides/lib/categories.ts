import { getAllPosts } from "./mdx-static";

export async function getAllCategories(): Promise<string[]> {
  const posts = await getAllPosts();

  const categories = new Set<string>();

  posts.forEach((post) => {
    post.categories?.forEach((category) => {
      categories.add(category);
    });
  });

  return Array.from(categories).sort();
}
