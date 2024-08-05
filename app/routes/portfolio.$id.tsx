import {
  Page,
  Text,
  Card,
  InlineStack,
  Thumbnail,
  Box,
  BlockStack,
} from "@shopify/polaris";
import { data } from "../data/custom_data";
import { StarRatings } from "~/components/StarRatings";

const projects: Data = data[0];

export default function Welcome() {
  return (
    <Page>
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
                {projects.client}
              </Text>
              <div style={{ fontStyle: "italic" }}>- {projects.company}</div>
            </InlineStack>
            <InlineStack gap={"100"}>
              <StarRatings rating={projects.testimonial.rating} />
            </InlineStack>
          </BlockStack>
        </InlineStack>
      </Card>
    </Page>
  );
}
