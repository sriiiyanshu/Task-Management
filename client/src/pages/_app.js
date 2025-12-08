import "@/styles/globals.css";
import Squares from "@/components/Squares";

export default function App({ Component, pageProps }) {
  return (
    <>
      <div className="fixed inset-0 -z-10 bg-gray-950">
        <Squares 
          speed={0.5} 
          squareSize={40}
          direction='diagonal'
          borderColor='#333'
          hoverFillColor='#1a1a1a'
        />
      </div>
      <Component {...pageProps} />
    </>
  );
}
