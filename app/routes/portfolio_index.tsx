import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import en from "@shopify/polaris/locales/en.json";
import "@shopify/polaris/build/esm/styles.css";
import {
  AppProvider,
  Link,
  Page,
  Text,
} from "@shopify/polaris";
import { login } from "../shopify.server";
import { data } from "../data/custom_data";
import { cli } from "@remix-run/dev";
import { ProjectsList } from "~/components/ProjectsList";

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
      <Page>
        <ProjectsList data={data} />
      </Page>
    </AppProvider>
  );
}