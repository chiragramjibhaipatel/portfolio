import {
  BlockStack,
  Box,
  Button,
  Card,
  DropZone,
  Form,
  FormLayout,
  InlineGrid,
  InlineStack,
  Layout,
  List,
  Page,
  Text,
  TextField,
} from "@shopify/polaris";
import { EditIcon } from "@shopify/polaris-icons";
import { TitleBar } from "@shopify/app-bridge-react";
import { json, LoaderFunctionArgs } from "@remix-run/node";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  console.log("params", params);
  return json({ params });
};

export default function NewClient() {
  return (
    <Page
      title="Add new client"
      backAction={{ content: "All Clients", url: "/app/clients" }}
      primaryAction={{ content: "Save", disabled: true, loading:false }}
    >
      <BlockStack gap={"200"}>
        <Layout>
          <Layout.Section>
            <BlockStack gap={"200"}>
              <Card>
                <FormLayout>
                  <TextField label="Name" autoComplete="off"></TextField>
                  <TextField label="Company" autoComplete="off"></TextField>
                  <TextField
                    label="Email"
                    autoComplete="off"
                    type="email"
                  ></TextField>
                  <TextField
                    label="About"
                    autoComplete="off"
                    multiline={6}
                  ></TextField>
                </FormLayout>
              </Card>
              <Card>
                <FormLayout>
                  <InlineGrid columns="1fr auto">
                    <Text as="h2" variant="headingSm">
                      Stores
                    </Text>
                    <Button
                      accessibilityLabel="Manage stores"
                      icon={EditIcon}
                    ></Button>
                  </InlineGrid>
                  <List>
                    <List.Item>www.storeone.com</List.Item>
                    <List.Item>www.storetwo.com</List.Item>
                  </List>
                </FormLayout>
              </Card>
            </BlockStack>
          </Layout.Section>
          <Layout.Section variant="oneThird">
            <FormLayout>
              <DropZone></DropZone>
              <Card>
                <Text as="h2" variant="bodyMd">
                  Tasks:
                </Text>
                <Box paddingBlockStart={"200"}>
                  <List>
                    <List.Item>task 1</List.Item>
                    <List.Item>task 2</List.Item>
                  </List>
                </Box>
              </Card>
            </FormLayout>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
