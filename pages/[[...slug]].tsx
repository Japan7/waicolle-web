import MarkdownPage from '../components/MarkdownPage';
import { getAllPostsSlugs, getPostData } from '../lib/posts';
import { PostData } from '../lib/types';

export async function getStaticPaths() {
  const paths = getAllPostsSlugs();
  paths.push({ params: { slug: [] } });
  return { paths, fallback: false };
}

export async function getStaticProps({ params }: { params: { slug: string[] } }) {
  const postData = await getPostData(params.slug);
  return { props: { postData } };
}

export default function Home({ postData }: { postData: PostData }) {
  return (
    <MarkdownPage>
      <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
    </MarkdownPage>
  );
};
