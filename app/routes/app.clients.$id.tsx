import {
  BlockStack,
  Box,
  Button,
  Card,
  DropZone,
  FormLayout,
  InlineGrid,
  Layout,
  List,
  Page,
  Text,
  TextField,
} from "@shopify/polaris";
import { EditIcon } from "@shopify/polaris-icons";
import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { z } from "zod";
import { useFetcher, useLoaderData } from "@remix-run/react";

//create schema for new client
const ClientSchema = z.object({
  name: z.string().min(3, {message: "Name must be at least 3 characters long"}),
  company: z.string().min(3, {message: "Company must be at least 3 characters long"}),
  about: z.string().optional()
})

export const loader = async ({ params }: LoaderFunctionArgs) => {
  console.log("params", params);
  return json({ params });
};

export const action = async ({request, params} : ActionFunctionArgs)=>{
  console.log("params action", params);
  const formData = await request.json();
  const result = ClientSchema.safeParse(formData);

  if(!result.success){
    return json({status: "error", errors: result.error.flatten()} as const, {status: 400});
  }

  const {name, company, about} = result.data;
  return json({status: "success", data: {name, company, about}});
} 

export default function NewClient() {
  const data = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const formIsLoading = ["loading", "submitting"].includes(fetcher.state);
  console.log("actionData", fetcher);
  function handleSubmit(): void {
    fetcher.submit(
      { name: "", company: "", about: "" },
      { method: "post", encType: "application/json" },
    );
  }

  return (
    <Page
      title="Add new client"
      backAction={{ content: "All Clients", url: "/app/clients" }}
      primaryAction={{
        content: "Save",
        disabled: false,
        loading: formIsLoading,
        onAction: handleSubmit,
      }}
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
