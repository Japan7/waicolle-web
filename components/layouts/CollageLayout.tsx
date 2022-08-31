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
import { useId } from "react";

const client = new ApolloClient({
  uri: "https://graphql.anilist.co",
  cache: new InMemoryCache(),
});

export default function CollageLayout({
  name,
  main,
  leftPanel,
  rightPanel,
}: {
  name: string;
  main: React.ReactNode;
  leftPanel?: React.ReactNode;
  rightPanel?: React.ReactNode;
}) {
  const router = useRouter();
  const { id } = router.query;

  const drawerId = useId();

  return (
    <ApolloProvider client={client}>
      <div className="h-screen pb-16 overflow-y-auto">
        <Head>
          <title>{name} | Waifu Collection</title>
        </Head>

        <div className="h-full drawer drawer-end drawer-mobile">
          <input id={drawerId} type="checkbox" className="drawer-toggle" />

          <div className="drawer-content flex flex-col">
            <nav className="navbar sticky top-0 shadow bg-base-100 bg-opacity-75 backdrop-blur">
              <div className="navbar-start">
                {leftPanel && (
                  <div className="dropdown dropdown-hover">
                    <label tabIndex={0} className="btn btn-ghost btn-square">
                      <AdjustmentsHorizontalIcon className="w-5 h-5" />
                    </label>
                    <div
                      tabIndex={0}
                      className="dropdown-content w-80 p-2 backdrop-brightness-50 backdrop-blur-sm rounded-box shadow"
                    >
                      {leftPanel}
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
                  <label
                    htmlFor={drawerId}
                    className="btn btn-ghost btn-square drawer-button lg:hidden"
                  >
                    <InformationCircleIcon className="w-5 h-5" />
                  </label>
                )}
              </div>
            </nav>

            <main className="m-2">{main}</main>
          </div>

          <div className="drawer-side">
            <label htmlFor={drawerId} className="drawer-overlay" />

            {rightPanel && (
              <div className="w-80 p-4 bg-base-100 border-l border-base-200">
                {rightPanel}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="btm-nav">
        <Link href={`/${id}/collage`}>
          <a className={router.route === "/[id]/collage" ? "active" : ""}>
            <Squares2X2Icon className="w-5 h-5" />
            <span className="btm-nav-label">Collage</span>
          </a>
        </Link>
        <Link href={`/${id}/daily`}>
          <a className={router.route === "/[id]/daily" ? "active" : ""}>
            <CalendarDaysIcon className="w-5 h-5" />
            <span className="btm-nav-label">Daily</span>
          </a>
        </Link>
        <Link href={`/${id}/pool`}>
          <a className={router.route === "/[id]/pool" ? "active" : ""}>
            <UserIcon className="w-5 h-5" />
            <span className="btm-nav-label">Pool</span>
          </a>
        </Link>
      </div>
    </ApolloProvider>
  );
}
