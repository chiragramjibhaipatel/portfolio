import {
  links as TestimonialLinks,
  Testimonials,
} from "~/components/Testimonials";
import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import en from "@shopify/polaris/locales/en.json";
import "@shopify/polaris/build/esm/styles.css";
import {
  AppProvider,
  Badge,
  BlockStack,
  Box,
  CalloutCard,
  Card,
  Icon,
  InlineStack,
  Layout,
  Link,
  Page,
  Text,
} from "@shopify/polaris";
import { data, items, uniqueTones } from "~/data/custom_data";
import { ProjectsList } from "~/components/ProjectsList";
import "blaze-slider/dist/blaze.css";
import "./styles.css";
import { LogoXIcon } from "@shopify/polaris-icons";
import db from "~/db.server";
import { useLoaderData } from "@remix-run/react";
import { NewsletterForm } from "~/components/newsletterForm";

export const links = () => [...TestimonialLinks];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);

  if (url.searchParams.get("shop")) {
    throw redirect(`/app?${url.searchParams.toString()}`);
  }
  let pageParam = url.searchParams.get("page");
  let page: number;
  if (pageParam) {
    page = parseInt(pageParam);
  } else {
    page = 1;
  }
  let pageSize = 50;
  const skip = (page - 1) * pageSize;
  const projects = await db.project.findMany({
    where: {
      visible: true,
    },
    select: {
      id: true,
      title: true,
      description: true,
      testimonial: true,
      client: {
        select: {
          name: true,
          company: true,
          imageUrl: true,
        },
      },
    },
    take: pageSize,
    skip,
  });
  const testimonials = await db.project.findMany({
    where: {
      visible: true,
      testimonial: {
        not: null,
      },
    },
    select: {
      id: true,
      testimonial: true,
      client: {
        select: {
          company: true,
          name: true,
          imageUrl: true,
        },
      },
    },
  });
  return json({ projects, testimonials });
};

export default function Portfolio() {
  let loaderData = useLoaderData<typeof loader>();
  const { projects, testimonials } = loaderData;
  return (
    <AppProvider i18n={en}>
      <Page>
        <Layout>
          <Layout.Section>
            <Card>
              <Layout>
                <Layout.Section>
                  <TitleContent />
                </Layout.Section>
                <Layout.Section variant={"oneThird"}>
                  <InlineStack gap={{ xs: "200" }} align={"center"}>
                    <img
                      src="https://cdn.shopify.com/s/files/1/0608/4752/1875/files/IMG_2425_Original_Copy.jpg?v=1723447358"
                      alt="Chirag Ramjibhai Patel"
                      style={{ borderRadius: "50%" }}
                      width={100}
                    />
                  </InlineStack>
                </Layout.Section>
                <Layout.Section>
                  <SocialMediaLinks />
                </Layout.Section>
              </Layout>
            </Card>
          </Layout.Section>
          <Layout.Section>
            <Layout>
              <Layout.Section>
                <ProjectsList data={data} projects={projects} />
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
            <Testimonials testimonials={testimonials} />
          </Layout.Section>
          <Layout.Section>
            <NewsletterForm />
          </Layout.Section>
          <Layout.Section>
            <CalloutCard
              title={"This website is a Shopify App - Remix template"}
              illustration={
                "https://cdn.shopify.com/shopifycloud/shopify_dev/assets/icons/48/app-2x-23fb62a245021a57818f731c5680cce151fa874356244bb6cfc4652be7161749.png"
              }
              primaryAction={{
                content: "View on Github",
                url: "https://github.com/chiragramjibhaipatel/portfolio",
              }}
            >
              <Text as={"p"}>
                This website is a Shopify App that uses Remix for server side
                rendering. It is a portfolio website that showcases the projects
                that I have worked on. It also has a newsletter form that allows
                you to subscribe to my newsletter.
              </Text>
              <Text as={"p"}>
                The Admin side of this website is an embedded Shopify App that
                allows you to manage the projects and clients. Visit the GitHub
                repository to learn more.
              </Text>
            </CalloutCard>
          </Layout.Section>
        </Layout>
      </Page>
    </AppProvider>
  );
}

function TitleContent() {
  return (
    <BlockStack gap={"200"}>
      <Text as={"h1"} variant={"heading2xl"}>
        {" "}
        Chirag Ramjibhai Patel
      </Text>
      <Text as={"p"}>
        I create shopify apps for living. Weekends are for trying new things. I
        write newsletter about day to day hurdles that I face in my work, so
        that I do not have to remember how things work 😉. I am a shopify
        developer and I am here to help you.
      </Text>
    </BlockStack>
  );
}

function SocialMediaLinks() {
  return (
    <InlineStack align={"start"} blockAlign={"start"}>
      <Box as={"div"} paddingInlineEnd={"200"}>
        <Link
          url="https://shopdevalliance.com/pages/members/chirag-patel"
          target="_blank"
        >
          <img
            height={20}
            src="https://shopdevalliance.com/cdn/shop/files/sda_logomark_color.svg"
          />
        </Link>
      </Box>
      <Box as={"div"} paddingInlineEnd={"200"}>
        <Link url="https://twitter.com/chirag_r__patel" target="_blank">
          <Icon source={LogoXIcon} tone="base" />
        </Link>
      </Box>
      <Box as={"div"} paddingInlineEnd={"200"}>
        <Link
          url="https://www.linkedin.com/in/chirag-ramjibhai-patel/"
          target="_blank"
        >
          <img
            height={20}
            src="https://content.linkedin.com/content/dam/me/business/en-us/amp/brand-site/v2/bg/LI-Bug.svg.original.svg"
          />
        </Link>
      </Box>
      <Box as={"div"} paddingInlineEnd={"200"}>
        <Link
          url="https://daily-developer-hurdles.beehiiv.com/"
          target="_blank"
        >
          <img height={20} src="https://support.beehiiv.com/favicon.ico" />
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
    </InlineStack>
  );
}

//todo: show the client thumb image in the testimonials
//todo: make project list paginated
//todo: add filters to the project list
//todo: implement remix Link component and get the benefit of prefetching - https://remix.run/docs/en/main/components/link#prefetch - But how to make it work with
//todo: add validation for the subscription field in the newsletter form - make sure that the email is valid and not empty
