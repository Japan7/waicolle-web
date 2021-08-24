import Head from 'next/head';
import PostLayout from '../components/PostLayout';
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
    <PostLayout home={postData.slug[0] == 'index'}>
      <Head>
        {postData.tags.title &&
          <title>{postData.tags.title} | Waifu Collection</title>}
      </Head>

      <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
    </PostLayout>
  );
};
