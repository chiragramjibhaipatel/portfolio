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
  Link,
  MediaCard,
  Page,
  Tag,
  Text,
} from "@shopify/polaris";
import { login } from "../../shopify.server";
import { data } from "../../data/custom_data";
import { ProjectsList } from "~/components/ProjectsList";
import { useBlazeSlider } from "react-blaze-slider";
import  "blaze-slider/dist/blaze.css";
import './styles.css'


export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);

  if (url.searchParams.get("shop")) {
    throw redirect(`/app?${url.searchParams.toString()}`);
  }

  return json({ showForm: Boolean(login) });
};

export default function Portfolio() {
    const ref = useBlazeSlider({
      all: {
        slidesToShow: 3,
      },
    });
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
                        <Badge tone="success">remix.run</Badge>
                        <Badge tone="attention">React</Badge>
                        <Badge tone="attention">express</Badge>
                        <Badge tone="attention">nodejs</Badge>
                        <Badge tone="attention-strong">MongoDb</Badge>
                        <Badge tone="read-only">sqlite</Badge>
                        <Badge tone="attention-strong">mysql</Badge>
                        <Badge tone="warning-strong">postgresql</Badge>
                        <Badge tone="success-strong">prisma</Badge>
                        <Badge tone="success">xata</Badge>
                        <Badge tone="attention-strong">fly.io</Badge>
                        <Badge tone="attention-strong">heroku</Badge>
                        <Badge tone="enabled">google cloud run</Badge>
                        <Badge tone="info-strong">Polaris</Badge>
                        <Badge tone="attention-strong">metaobjects</Badge>
                        <Badge tone="info">rest api</Badge>
                        <Badge tone="new">graphql api</Badge>
                        <Badge tone="info-strong">ajax api</Badge>
                        <Badge tone="attention">admin api</Badge>
                        <Badge tone="warning">storefront api</Badge>
                      </InlineStack>
                    </Layout.Section>
                  </Layout>
                </Card>
              </Layout.Section>
            </Layout>
          </Layout.Section>
          <Layout.Section>
            <div className="blaze-slider" ref={ref}>
              <div className="blaze-container">
                <div className="blaze-track-container">
                  <div className="blaze-track">
                    <Card>slide 1</Card>
                    <Card>slide 2</Card>
                    <Card>slide 3</Card>
                    <Card>slide 4</Card>
                    <Card>slide 5</Card>
                    <Card>slide 6</Card>
                    <Card>slide 7</Card>
                    <Card>slide 8</Card>
                  </div>
                </div>
                <>
                  {/* navigation buttons */}
                  <div className="controls">
                    <button className="blaze-prev">prev</button>
                    <div className="blaze-pagination"></div>
                    <button className="blaze-next">next</button>
                  </div>
                </>
              </div>
            </div>
          </Layout.Section>
        </Layout>
      </Page>
    </AppProvider>
  );
}
