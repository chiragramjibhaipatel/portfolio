import {
  Page,
  Layout,
  Banner,
  Text,
  FormLayout,
  TextField,
  CalloutCard,
  Card,
  InlineStack,
  Thumbnail,
  Avatar,
  MediaCard,
} from "@shopify/polaris";

export default function Welcome() {
  return (
    <Page>
      <Layout>
        <Layout.Section>
          <MediaCard
            title="Getting Started"
            description="Discover how Shopify can power up your entrepreneurial journey."
            size={"small"}
          >
            <img
              alt="Logo"
              width="100%"
              height="100%"
              style={{
                objectFit: "contain",
                objectPosition: "center",
              }}
              src="https://daensk.de/cdn/shop/files/daensk_512x168_07c26e4e-1a5d-4566-969e-cd4f1b9d598a.png?v=1709203756"
            />
          </MediaCard>
        </Layout.Section>
        <Layout.Section>BBB</Layout.Section>
      </Layout>
    </Page>
  );
}
