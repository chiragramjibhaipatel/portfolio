import {
  Page,
  Text,
  Card,
  InlineStack,
  Thumbnail,
  Box,
  BlockStack,
  Layout,
  Bleed,
  Badge,
} from "@shopify/polaris";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { uniqueTones } from "~/data/custom_data";
import type { LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import db from "~/db.server";
import { useLoaderData } from "@remix-run/react";

export const loader: LoaderFunction = async ({
  params,
}: LoaderFunctionArgs) => {
  const { id } = params;
  console.log("Portfolio ID: ", id);
  const project = await db.project.findUnique({
    where: {
      id: id,
    },
    select: {
      title: true,
      description: true,
      solution: true,
      hurdles: true,
      tags: true,
      testimonial: true,
      client: {
        select: {
          name: true,
          company: true,
          about: true,
          imageUrl: true,
        },
      },
    },
  });

  return json({ project });
};

export default function Welcome() {
  let { project } = useLoaderData<typeof loader>();
  return (
    <Page>
      <BlockStack gap="1200">
        <PortfolioHeader project={project} />
        <Card>
          <BlockStack gap={"200"}>
            <Text as="h2" variant="headingLg">
              <Box paddingInlineStart={"200"} paddingBlockEnd={"200"}>
                {project.title}
              </Box>
            </Text>
            <Layout>
              <Layout.Section>
                <Card roundedAbove="sm">
                  <BlockStack gap="200">
                    <Text as="h2" variant="headingMd">
                      Description:
                    </Text>
                    <Box paddingBlockEnd="200">
                      <Markdown remarkPlugins={[remarkGfm]}>
                        {project.description}
                      </Markdown>
                    </Box>
                    <Text as="h2" variant="headingSm">
                      Solution/Implementation
                    </Text>
                    <Box paddingBlockEnd="200">
                      <Markdown remarkPlugins={[remarkGfm]}>
                        {project.solution}
                      </Markdown>
                    </Box>
                  </BlockStack>
                  <Bleed marginBlockEnd="400" marginInline="400">
                    <Box background="bg-surface-secondary" padding="400">
                      <BlockStack gap="200">
                        <InlineStack gap={"100"}>
                          {project.tags.map((item: string, index: number) => (
                            <Badge
                              key={item}
                              tone={uniqueTones[index % uniqueTones.length]}
                            >
                              {item}
                            </Badge>
                          ))}
                        </InlineStack>
                      </BlockStack>
                    </Box>
                  </Bleed>
                </Card>
              </Layout.Section>
              <Layout.Section variant="oneThird">
                <BlockStack gap={"200"}>
                  <Card>
                    <BlockStack gap={"200"}>
                      <Text as="h2" variant="headingMd">
                        Hurdles/Challenges:
                      </Text>
                      <Box paddingBlockEnd="200">
                        <Markdown remarkPlugins={[remarkGfm]}>
                          {project.hurdles}
                        </Markdown>
                      </Box>
                    </BlockStack>
                  </Card>
                  <Card>
                    <BlockStack gap={"200"}>
                      <Text as="h2" variant="headingMd">
                        Client Review:
                      </Text>
                      <Box paddingBlockEnd="200">
                        <Text as={"h4"}>
                          <div style={{ fontStyle: "italic" }}>
                            {project.testimonial}
                          </div>
                        </Text>
                      </Box>
                    </BlockStack>
                  </Card>
                </BlockStack>
              </Layout.Section>
            </Layout>
          </BlockStack>
        </Card>
      </BlockStack>
    </Page>
  );
}

function PortfolioHeader({
  project,
}: {
  project: {
    id: string;
    title: string;
    solution: string;
    client: { name: string; company: string; imageUrl: string; about: string };
  };
}) {
  return (
    <Card>
      <InlineStack>
        <Box>
          <Thumbnail
            source={project.client?.imageUrl}
            alt="Black choker necklace"
            transparent={true}
            size="large"
          />
        </Box>
        <Box width={"70%"} paddingInlineStart={"400"}>
          <BlockStack gap={"150"}>
            <InlineStack blockAlign="end" gap={"100"}>
              <Text variant="headingLg" as={"h2"}>
                {project.client?.name}
              </Text>
              <div
                style={{
                  fontStyle: "italic",
                }}
              >
                - {project.client?.company}
              </div>
            </InlineStack>
            <div
              style={{
                fontStyle: "italic",
              }}
            >
              {project.client?.about}
            </div>
          </BlockStack>
        </Box>
      </InlineStack>
    </Card>
  );
}

//todo: hide the client review if there is no review
//todo: hide the hurdles if there are no hurdles
//todo: add back button to go to the portfolio page
//todo: implement markdown preview
//todo: implement a feature to ask client for testimonial - implement the form that client can use to submit the testimonial
//todo: add scroll for solution, hurdle and client review section
