import Head from 'next/head';
import Live2D from '../components/layouts/Live2D';
import Markdown from '../components/layouts/Markdown';
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
    <Live2D>
      <Markdown home={postData.slug[0] == 'index'}>
        <Head>
          {postData.tags.title &&
            <title>{postData.tags.title} | Waifu Collection</title>}
        </Head>

        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </Markdown>
    </Live2D>
  );
};
