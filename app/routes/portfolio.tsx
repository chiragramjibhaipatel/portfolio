import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import en from "@shopify/polaris/locales/en.json";
import "@shopify/polaris/build/esm/styles.css";
import {
  AppProvider,
} from "@shopify/polaris";
import { login } from "../shopify.server";
import { Outlet } from "@remix-run/react";


export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);

  if (url.searchParams.get("shop")) {
    throw redirect(`/app?${url.searchParams.toString()}`);
  }

  return json({ showForm: Boolean(login) });
};

export default function App() {

  return (
    <AppProvider i18n={en}>
      <Outlet />
    </AppProvider>
  );
}
