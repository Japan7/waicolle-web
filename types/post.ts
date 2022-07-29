export interface PostData {
  slug: string[];
  contentHtml: string;
  tags: PostTags;
}

export interface PostTags {
  title?: string;
  [key: string]: string | undefined;
}
