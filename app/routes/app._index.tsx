import { useEffect } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {useFetcher, useLoaderData} from "@remix-run/react";
import { Page } from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "~/shopify.server";
import { AdminProjectsList } from "~/components/AdminProjectsList";
import db from "../db.server";



export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const projects = await db.project.findMany({
    where: { sessionId: session.id },
    orderBy: { xata_createdat: "desc" },
      select: {
        id: true,
          title: true,
          description: true,
          status: true,
          clientId: true,
          storeUrl: true,
          client: {
            select: {
                name: true,
                company: true,
            }
          }
          
      }
  });
  return json({ projects });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  const color = ["Red", "Orange", "Yellow", "Green"][
    Math.floor(Math.random() * 4)
  ];
  const response = await admin.graphql(
    `#graphql
        mutation populateProduct($input: ProductInput!) {
            productCreate(input: $input) {
                product {
                    id
                    title
                    handle
                    status
                    variants(first: 10) {
                        edges {
                            node {
                                id
                                price
                                barcode
                                createdAt
                            }
                        }
                    }
                }
            }
        }`,
    {
      variables: {
        input: {
          title: `${color} Snowboard`,
        },
      },
    },
  );
  const responseJson = await response.json();

  const variantId =
    responseJson.data!.productCreate!.product!.variants.edges[0]!.node!.id!;
  const variantResponse = await admin.graphql(
    `#graphql
        mutation shopifyRemixTemplateUpdateVariant($input: ProductVariantInput!) {
            productVariantUpdate(input: $input) {
                productVariant {
                    id
                    price
                    barcode
                    createdAt
                }
            }
        }`,
    {
      variables: {
        input: {
          id: variantId,
          price: Math.random() * 100,
        },
      },
    },
  );

  const variantResponseJson = await variantResponse.json();

  return json({
    product: responseJson!.data!.productCreate!.product,
    variant: variantResponseJson!.data!.productVariantUpdate!.productVariant,
  });
};

export default function Index() {
    let {projects} = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();

  const shopify = useAppBridge();
  const isLoading =
    ["loading", "submitting"].includes(fetcher.state) &&
    fetcher.formMethod === "POST";
  const productId = fetcher.data?.product?.id.replace(
    "gid://shopify/Product/",
    "",
  );

  useEffect(() => {
    if (productId) {
      shopify.toast.show("Product created");
    }
  }, [productId, shopify]);
  const generateProduct = () => fetcher.submit({}, { method: "POST" });

  return (
    <Page>
      <TitleBar title="Your Personal Portfolio"></TitleBar>
      <AdminProjectsList allProjects={projects} />
    </Page>
  );
}
