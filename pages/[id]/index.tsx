import { NextPage } from "next";
import Head from "next/head";
import CollageLayout from "../../components/layouts/CollageLayout";

const Index: NextPage = () => {
  return (
    <CollageLayout>
      <Head>
        <title>Collage portal | Waifu Collection</title>
      </Head>

      <p className="p-2">Select a collage</p>
    </CollageLayout>
  );
};

export default Index;
