import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import PostLayout from "../components/layouts/PostLayout";
import { getAllPostsSlugs, getPostData } from "../lib/posts";
import { PostData } from "../types/post";

interface HomeProps {
  postData: PostData;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllPostsSlugs();
  paths.push({ params: { slug: [] } });
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<
  HomeProps,
  { slug: string[] }
> = async ({ params }) => {
  const postData = await getPostData(params?.slug);
  return { props: { postData } };
};

const Home: NextPage<HomeProps> = ({ postData }) => {
  return (
    <PostLayout home={postData.slug[0] === "index"}>
      <Head>
        {postData.tags.title && (
          <title>{`${postData.tags.title} | Waifu Collection`}</title>
        )}
      </Head>

      <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
    </PostLayout>
  );
};

export default Home;
