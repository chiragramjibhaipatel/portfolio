import {
  Card,
  Layout,
  Page,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { json, LoaderFunctionArgs } from "@remix-run/node";

export const loader = async ({request, params}: LoaderFunctionArgs) => {
  console.log("params", params);
  return json({params});
}


export default function NewClient() {
  return (
    <Page>
      <TitleBar title="New Client" />
      
    </Page>
  );
}


