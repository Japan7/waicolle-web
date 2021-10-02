import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import Link from 'next/link';
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
      <Link href={`/${id}/collage`}><a>Click here.</a></Link>

      <h2>Daily tag</h2>
      <Link href={`/${id}/daily`}><a>Click here.</a></Link>

      <h2>Character pool</h2>
      <Link href={`/${id}/pool`}><a>Click here.</a></Link>
    </PostLayout>
  );
}
