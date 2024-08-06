import { Testimonials } from "./../../components/Testimonials";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import en from "@shopify/polaris/locales/en.json";
import "@shopify/polaris/build/esm/styles.css";
import {
  AppProvider,
  Badge,
  Card,
  InlineStack,
  Layout,
  MediaCard,
  Page,
  Text,
} from "@shopify/polaris";
import { login } from "../../shopify.server";
import { data, items, uniqueTones } from "../../data/custom_data";
import { ProjectsList } from "~/components/ProjectsList";
import "blaze-slider/dist/blaze.css";
import "./styles.css";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);

  if (url.searchParams.get("shop")) {
    throw redirect(`/app?${url.searchParams.toString()}`);
  }

  return json({ showForm: Boolean(login) });
};

export default function Portfolio() {
  

  return (
    <AppProvider i18n={en}>
      <Page>
        <Layout>
          <Layout.Section>
            <MediaCard
              title="Getting Started"
              description="Discover how Shopify can power up your entrepreneurial journey."
              size="small"
            >
              <img
                alt=""
                width="100%"
                height="100%"
                style={{
                  objectFit: "cover",
                  objectPosition: "center",
                }}
                src="https://burst.shopifycdn.com/photos/business-woman-smiling-in-office.jpg?width=1850"
              />
            </MediaCard>
          </Layout.Section>
          <Layout.Section>
            <Layout>
              <Layout.Section>
                <ProjectsList data={data} />
              </Layout.Section>
              <Layout.Section variant="oneThird">
                <Card>
                  <Layout>
                    <Layout.Section>
                      <Text as="h2" variant="headingSm">
                        Things I have hands on with
                      </Text>
                    </Layout.Section>
                    <Layout.Section>
                      <InlineStack gap={"100"}>
                        {items.map((item, index) => (
                          <Badge
                            key={item.id}
                            tone={uniqueTones[index % uniqueTones.length]}
                          >
                            {item.name}
                          </Badge>
                        ))}
                      </InlineStack>
                    </Layout.Section>
                  </Layout>
                </Card>
              </Layout.Section>
            </Layout>
          </Layout.Section>
          <Layout.Section>
            <Testimonials data={data} />
          </Layout.Section>
        </Layout>
      </Page>
    </AppProvider>
  );
}
