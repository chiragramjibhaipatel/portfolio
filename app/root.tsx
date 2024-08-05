import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { PortfolioBackground } from "./components/PortfolioBackbround";
import { useEffect, useState } from "react";


export default function App() {
  const [isPortfolio, setIsPortfolio] = useState(false);
  useEffect(() => {
    //check if the pathname is /app
    if (window.location.pathname.startsWith("/portfolio")) {
      setIsPortfolio(true);
    }

  }, []);

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="preconnect" href="https://cdn.shopify.com/" />
        <link
          rel="stylesheet"
          href="https://cdn.shopify.com/static/fonts/inter/v4/styles.css"
        />
        <Meta />
        <Links />
      </head>
      <body>
        {isPortfolio && <PortfolioBackground />}
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}


