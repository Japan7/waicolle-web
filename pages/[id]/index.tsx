import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import PostLayout from '../../components/layouts/PostLayout';

export default function Index() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <PostLayout>
      <Head>
        <title>Collage portal | Waifu Collection</title>
      </Head>

      <h1>Collage portal</h1>

      <h2>Waifu Collage</h2>
      <a href={`/${id}/collage`}>Click here.</a>

      <h2>Daily tag</h2>
      <a href={`/${id}/daily`}>Click here.</a>

      <h2>Character pool</h2>
      <a href={`/${id}/pool`}>Click here.</a>
    </PostLayout>
  );
}
