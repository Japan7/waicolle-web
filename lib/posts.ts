import fs from 'fs';
import glob from 'glob';
import matter from 'gray-matter';
import path from 'path';
import { remark } from 'remark';
import html from 'remark-html';
import { PostData } from './types';

const postsDirectory = path.join(process.cwd(), 'posts');

export function getAllPostsSlugs() {
  const fileNames = glob.sync('**/*.md', { cwd: postsDirectory });
  return fileNames.map(fileName => (
    {
      params: {
        slug: fileName.replace(/\.md$/, '').split('/')
      }
    }
  ));
}

export async function getPostData(slug: string[] | undefined): Promise<PostData> {
  const fullPath = path.join(postsDirectory, slug ? `${slug.join('/')}.md` : 'index.md');
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark().use(html).process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Combine the data with the id and contentHtml
  return { contentHtml, ...matterResult.data };
}
