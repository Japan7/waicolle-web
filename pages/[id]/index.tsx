import Head from 'next/head';
import CollageLayout from '../../components/layouts/CollageLayout';

export default function Index() {
  return (
    <CollageLayout>
      <Head>
        <title>Collage portal | Waifu Collection</title>
      </Head>

      <p className="p-2">Select a collage</p>
    </CollageLayout>
  );
}
