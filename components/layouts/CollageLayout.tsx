import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import {
  AdjustmentsHorizontalIcon,
  CalendarDaysIcon,
  InformationCircleIcon,
  Squares2X2Icon,
  UserIcon,
} from "@heroicons/react/24/solid";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useId, useState } from "react";

const client = new ApolloClient({
  uri: "https://graphql.anilist.co",
  cache: new InMemoryCache(),
});

export default function CollageLayout({
  name,
  main,
  rightPanel,
  leftMenu,
}: {
  name: string;
  main: (
    drawerContentDivId: string,
    setRightPanelActive: (active: boolean) => void
  ) => React.ReactNode;
  rightPanel?: React.ReactNode;
  leftMenu?: React.ReactNode;
}) {
  const router = useRouter();
  const { client_id } = router.query;

  const [rightPanelActive, setRightPanelActive] = useState(false);
  const drawerContentDivId = useId();

  return (
    <ApolloProvider client={client}>
      <div className="h-screen pb-16">
        <Head>
          <title>{name} | Waifu Collection</title>
        </Head>

        <div className="h-full drawer drawer-end drawer-mobile">
          <input
            defaultChecked={rightPanelActive}
            type="checkbox"
            className="drawer-toggle"
          />

          <div id={drawerContentDivId} className="drawer-content flex flex-col">
            <nav className="navbar sticky top-0 shadow bg-base-100 bg-opacity-75 backdrop-blur z-10">
              <div className="navbar-start">
                {leftMenu && (
                  <div className="dropdown dropdown-hover">
                    <label tabIndex={0} className="btn btn-ghost btn-square">
                      <AdjustmentsHorizontalIcon className="w-5 h-5" />
                    </label>
                    <div
                      tabIndex={0}
                      className="dropdown-content w-80 p-2 rounded-box shadow bg-base-100 bg-opacity-75"
                    >
                      {leftMenu}
                    </div>
                  </div>
                )}
              </div>
              <div className="navbar-center">
                <div className="text-xl font-semibold">
                  <span className="text-primary">Wai</span>
                  <span className="text-secondary">{name}</span>
                </div>
              </div>
              <div className="navbar-end">
                {rightPanel && (
                  <button
                    onClick={() => setRightPanelActive(true)}
                    className="btn btn-ghost btn-square drawer-button lg:hidden"
                  >
                    <InformationCircleIcon className="w-5 h-5" />
                  </button>
                )}
              </div>
            </nav>

            <main className="p-2">
              {main(drawerContentDivId, setRightPanelActive)}
            </main>
          </div>

          <div className="drawer-side">
            <button
              onClick={() => setRightPanelActive(false)}
              className="drawer-overlay"
            />

            {rightPanel && (
              <div className="w-80 p-4 bg-base-100 border-l border-base-200 max-w-[75vw]">
                {rightPanel}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="btm-nav">
        <Link href={`/${client_id}/collage`}>
          <a
            className={router.route === "/[client_id]/collage" ? "active" : ""}
          >
            <Squares2X2Icon className="w-5 h-5" />
            <span className="btm-nav-label">Collage</span>
          </a>
        </Link>
        <Link href={`/${client_id}/daily`}>
          <a className={router.route === "/[client_id]/daily" ? "active" : ""}>
            <CalendarDaysIcon className="w-5 h-5" />
            <span className="btm-nav-label">Daily</span>
          </a>
        </Link>
        {/* <Link href={`/${client_id}/pool`}>
          <a className={router.route === "/[client_id]/pool" ? "active" : ""}>
            <UserIcon className="w-5 h-5" />
            <span className="btm-nav-label">Pool</span>
          </a>
        </Link> */}
      </div>
    </ApolloProvider>
  );
}
