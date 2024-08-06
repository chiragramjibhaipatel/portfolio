import {
  Page,
  Text,
  Card,
  InlineStack,
  Thumbnail,
  Box,
  BlockStack,
  Layout,
  List,
  Bleed,
  Badge,
} from "@shopify/polaris";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

const markdown = "# Hi, *Pluto*!";

import { data, uniqueTones } from "../data/custom_data";
const projects: Data = data[0];

export default function Welcome() {
  return (
    <Page>
      <BlockStack gap="1200">
        <PortfolioHeader projects={projects} />
        <Card>
          <BlockStack gap={"200"}>
            <Text as="h2" variant="headingLg">
              {projects.title}
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
                        {projects.description}
                      </Markdown>
                    </Box>
                    <Text as="h2" variant="headingSm">
                      Solution/Implementation
                    </Text>
                    <Box paddingBlockEnd="200">
                      <Markdown remarkPlugins={[remarkGfm]}>
                        {markdown}
                      </Markdown>
                    </Box>
                  </BlockStack>
                  <Bleed marginBlockEnd="400" marginInline="400">
                    <Box background="bg-surface-secondary" padding="400">
                      <BlockStack gap="200">
                        <Text as="h3" variant="headingSm" fontWeight="medium">
                          Tools Used
                        </Text>
                        <InlineStack gap={"100"}>
                          {projects.tools.map((item, index) => (
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
                <Card>
                  <BlockStack gap={"200"}>
                    <Text as="h2" variant="headingMd">
                      Hurdles/Challenges:
                    </Text>
                    <Box paddingBlockEnd="200">
                      <Markdown remarkPlugins={[remarkGfm]}>
                        {markdown}
                      </Markdown>
                    </Box>
                  </BlockStack>
                </Card>
              </Layout.Section>
            </Layout>
          </BlockStack>
        </Card>
      </BlockStack>
    </Page>
  );
}

function PortfolioHeader({ projects }: { projects: Data }) {
  return (
    <Card>
      <InlineStack gap={"200"}>
        <Thumbnail
          source="https://daensk.de/cdn/shop/files/daensk_512x168_07c26e4e-1a5d-4566-969e-cd4f1b9d598a.png"
          alt="Black choker necklace"
          transparent={true}
          size="large"
        />
        <BlockStack gap={"150"}>
          <InlineStack blockAlign="end" gap={"100"}>
            <Text variant="headingLg" as={"span"}>
              {projects.client?.name}
            </Text>
            <div
              style={{
                fontStyle: "italic",
              }}
            >
              - {projects.client?.company}
            </div>
          </InlineStack>
          <InlineStack gap={"100"}>
            <div
              style={{
                fontStyle: "italic",
              }}
            >
              - {projects.client?.about}
            </div>
          </InlineStack>
        </BlockStack>
      </InlineStack>
    </Card>
  );
}
