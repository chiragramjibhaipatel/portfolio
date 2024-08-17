import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "@remix-run/react";
import { PortfolioBackground } from "./components/PortfolioBackbround";
import { useEffect, useState } from "react";
import faviconSvgUrl from "./assets/favicon.svg";
import { LinksFunction, MetaFunction } from "@remix-run/node";
import customStylesUrl from "./assets/custom.css?url";

export const meta: MetaFunction = () => {
  return [
    { title: "Chirag Ramjibhai Patel - Shopify Developer" },
    {
      property: "og:title",
      content: "Chirag Ramjibhai Patel - Shopify Developer",
    },
    {
      name: "description",
      content:
        "I create custom shopify apps to make your life easier. Reach out to me for a 30 minute free consultation. We can discuss your project and see if we are a good fit.",
    },
  ];
};

export const links: LinksFunction = () => {
  return [
    { rel: "icon", type: "image/svg+xml", href: faviconSvgUrl },
    { rel: "stylesheet", href: customStylesUrl },
  ];
};

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
        <script src="http://localhost:8097"></script>
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

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);
  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        {/* add the UI you want your users to see */}
        <h1>Oh no!</h1>
        <Scripts />
      </body>
    </html>
  );
}
