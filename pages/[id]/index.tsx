import { NextPage } from "next";
import CollageLayout from "../../components/layouts/CollageLayout";

const Index: NextPage = () => {
  return <CollageLayout name="Portal" main={() => <p>Select a collage</p>} />;
};

export default Index;
