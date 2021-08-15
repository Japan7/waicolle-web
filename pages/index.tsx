import MarkdownPage from '../components/MarkdownPage';
import { getPostData } from '../lib/posts';
import { PostData } from '../lib/types';

export async function getStaticProps() {
  const postData = await getPostData('index');
  return { props: { postData } };
}

export default function Home({ postData }: { postData: PostData }) {
  return (
    <MarkdownPage>
      <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
    </MarkdownPage>
  );
};
