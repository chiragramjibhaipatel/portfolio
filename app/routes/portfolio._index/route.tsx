import {Testimonials, links as TestimonialLinks} from "~/components/Testimonials";
import type {LoaderFunctionArgs} from "@remix-run/node";
import {json, redirect} from "@remix-run/node";
import en from "@shopify/polaris/locales/en.json";
import "@shopify/polaris/build/esm/styles.css";
import {
  AppProvider,
  Badge,
  BlockStack,
  Box,
  Card,
  Icon,
  InlineStack,
  Layout,
  Link,
  Page,
  Text,
} from "@shopify/polaris";
import {login} from "~/shopify.server";
import {data, items, uniqueTones} from "~/data/custom_data";
import {ProjectsList} from "~/components/ProjectsList";
import "blaze-slider/dist/blaze.css";
import "./styles.css";
import {LogoXIcon} from "@shopify/polaris-icons";

export const links = () => [...TestimonialLinks];

export const loader = async ({request}: LoaderFunctionArgs) => {
  const url = new URL(request.url);

  if (url.searchParams.get("shop")) {
    throw redirect(`/app?${url.searchParams.toString()}`);
  }

  return json({showForm: Boolean(login)});
};


export default function Portfolio() {

  return (<AppProvider i18n={en}>
    <Page>
      <Layout>
        <Layout.Section>
          <Card>
            <Layout>
              <Layout.Section>
                <TitleContent/>
              </Layout.Section>
              <Layout.Section variant={"oneThird"}>
                <InlineStack gap={{"xs": "200"}} align={"center"}>
                  <img
                    src="https://cdn.shopify.com/s/files/1/0608/4752/1875/files/IMG_2425_Original_Copy.jpg?v=1723447358"
                    alt="Chirag Ramjibhai Patel" style={{borderRadius: "50%"}} width={100}/>
                </InlineStack>
              </Layout.Section>
              <Layout.Section>
                <SocialMediaLinks/>
              </Layout.Section>
            </Layout>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Layout>
            <Layout.Section>
              <ProjectsList data={data}/>
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
                      {items.map((item, index) => (<Badge
                        key={item.id}
                        tone={uniqueTones[index % uniqueTones.length]}
                      >
                        {item.name}
                      </Badge>))}
                    </InlineStack>
                  </Layout.Section>
                </Layout>
              </Card>
            </Layout.Section>
          </Layout>
        </Layout.Section>
        <Layout.Section>
          <Testimonials data={data}/>
        </Layout.Section>
      </Layout>
    </Page>
  </AppProvider>);
}

function TitleContent() {
  return (<BlockStack gap={"200"}>
    <Text as={"h1"} variant={"heading2xl"}> Chirag Ramjibhai Patel</Text>
    <Text as={"p"}>
      I create shopify apps for living. Weekends are for trying new things. I write
      newsletter about day to day hurdles that I face in my work, so that I do not have to remember how
      things work 😉. I am a shopify developer and I am here to help you.
    </Text>
  </BlockStack>);
}

function SocialMediaLinks() {
  return <InlineStack align={"start"} blockAlign={"start"}>
    <Box as={"div"} paddingInlineEnd={"200"}>
      <Link url="https://twitter.com/chirag_r__patel" target="_blank">
        <Icon
          source={LogoXIcon}
          tone="base"
        />
      </Link>
    </Box>
    <Box as={"div"} paddingInlineEnd={"200"}>
      <Link url="https://www.linkedin.com/in/chirag-ramjibhai-patel/" target="_blank">
        <img
          height={20}
          src="https://content.linkedin.com/content/dam/me/business/en-us/amp/brand-site/v2/bg/LI-Bug.svg.original.svg"
        />
      </Link>
    </Box>
    <Box as={"div"} paddingInlineEnd={"200"}>
      <Link url="https://daily-developer-hurdles.beehiiv.com/" target="_blank">
        <img
          height={20}
          src="https://support.beehiiv.com/favicon.ico"
        />
      </Link>
    </Box>
    <Box as={"div"} paddingInlineEnd={"200"} paddingInlineStart={"100"}>
      <Link url="mailto:chiragramjibhaipatel@gmail.com">
        <img
          height={20}
          width={22}
          src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg"
        />

      </Link>
    </Box>

  </InlineStack>;
}
