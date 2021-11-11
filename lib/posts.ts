import fs from 'fs';
import glob from 'glob';
import matter from 'gray-matter';
import { marked } from 'marked';
import path from 'path';
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
  slug ??= ['index'];
  const fullPath = path.join(postsDirectory, `${path.join(...slug)}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const matterResult = matter(fileContents);
  const contentHtml = marked.parse(matterResult.content);

  return {
    slug,
    contentHtml,
    tags: matterResult.data
  };
}
