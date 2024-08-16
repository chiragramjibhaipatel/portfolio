import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import {PortfolioBackground} from "./components/PortfolioBackbround";
import {useEffect, useState} from "react";
import faviconSvgUrl from "./assets/favicon.svg"
import {LinksFunction, MetaFunction} from "@remix-run/node";


export const meta: MetaFunction = () => {
  return [
    { title: "Chirag Ramjibhai Patel - Shopify Developer" },
    {
      property: "og:title",
      content: "Chirag Ramjibhai Patel - Shopify Developer",
    },
    {
      name: "description",
      content: "I create custom shopify apps to make your life easier. Reach out to me for a 30 minute free consultation. We can discuss your project and see if we are a good fit.",
    },
  ];
};


export const links: LinksFunction = () => {
  return [
    {rel: "icon", type: 'image/svg+xml', href: faviconSvgUrl}
  ]
}


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
      <meta charSet="utf-8"/>
      <meta name="viewport" content="width=device-width,initial-scale=1"/>
      <link rel="preconnect" href="https://cdn.shopify.com/"/>
      <link
        rel="stylesheet"
        href="https://cdn.shopify.com/static/fonts/inter/v4/styles.css"
      />
      <Meta/>
      <Links/>
    </head>
    <body>
    {isPortfolio && <PortfolioBackground/>}
    <Outlet/>
    <ScrollRestoration/>
    <Scripts/>
    </body>
    </html>
  );
}


