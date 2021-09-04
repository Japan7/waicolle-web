import dynamic from 'next/dynamic';
import Script from 'next/script';
import { ErrorBoundary } from 'react-error-boundary';

const ReactLive2d = dynamic<any>(() => import('react-live2d'), { ssr: false });

export default function Live2D() {

  const touchStrings = [
    'DRP ZN?',
    'moe moe coin',
    "z0gl0gl0'd",
    'frtt?',
    '1',
    ':saladedefruits:',
    'moyenned',
    "rng'ed",
  ];

  return (
    <ErrorBoundary fallback={<></>}>
      <Script src="/live2d/live2dcubismcore.min.js" strategy="beforeInteractive" />

      <ReactLive2d
        width={300}
        height={500}
        right="20px"
        bottom="-30px"
        ModelList={['rice_pro_t03']}
        TouchBody={touchStrings}
        TouchHead={touchStrings}
        TouchDefault={touchStrings}
        PathFull="/live2d/"
        menuList={[]}
      />

      <style jsx global>{`
        #live2d-container {
          @apply hidden lg:block;
        }
        #live2d-print {
          @apply bg-opacity-50 bg-gray-900 text-gray-100 top-16 right-0 left-auto !important;
        }
      `}</style>
    </ErrorBoundary>
  );
}
