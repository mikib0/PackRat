import type { Post } from "./types"

// Function to fetch all categories
export async function fetchCategories(): Promise<string[]> {
  const response = await fetch("/api/categories")
  if (!response.ok) {
    throw new Error("Failed to fetch categories")
  }
  const data = await response.json()
  return data.categories
}

// Function to fetch all posts
export async function fetchPosts(): Promise<Post[]> {
  const response = await fetch("/api/posts")
  if (!response.ok) {
    throw new Error("Failed to fetch posts")
  }
  const data = await response.json()
  return data.posts
}

