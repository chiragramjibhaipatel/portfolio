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
import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { z } from "zod";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { authenticate } from "~/shopify.server";
import db from "../db.server";
import { useEffect, useState } from "react";
//create schema for new client
const ClientSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" }),
  company: z
    .string()
    .min(3, { message: "Company must be at least 3 characters long" })
    .optional(),
  about: z.string().optional(),
  email: z.string().email().optional(),
});

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  console.log("SessionId: ", session.id);

  const { id } = params;
  if (id === "add") {
    return {};
  }
  const client = await db.client.findUnique({
    where: {
      id: id,
      sessionId: session.id,
    },
    select: {
      name: true,
      company: true,
      about: true,
      email: true,
    },
  });
  return { client };
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const formData = await request.json();
  const result = ClientSchema.safeParse(formData);

  if (!result.success) {
    return json({ status: "error", errors: result.error.flatten() } as const, {
      status: 400,
    });
  }

  const { name, company, about, email } = result.data;
  let client;
  if (params.id === "add") {
    console.log("Creating New Client");
    client = await db.client.create({
      data: {
        name,
        company,
        about,
        email,
        sessionId: session.id,
      },
    });
    return redirect(`/app/clients/${client.id}`);
  } else {
    console.log("Updating Client", params.id);
    client = await db.client.update({
      where: {
        id: params.id,
        sessionId: session.id,
      },
      data: {
        name,
        company,
        about,
        email,
      },
    });
    return { status: "success" };
  }
};

export default function NewClient() {
  let data = useLoaderData<typeof loader>();
  const [clientData, setClientData] = useState(data?.client ?? null);
  const [formErrors, setFormErrors] = useState({});
  console.log("loader data: ", data);
  const fetcher = useFetcher();
  const formIsLoading = ["loading", "submitting"].includes(fetcher.state);
  useEffect(() => {
    if(fetcher?.data?.errors && !formIsLoading){
      setFormErrors(fetcher.data.errors.fieldErrors);
    }
  }, [fetcher]);


  console.log("Fetch State: ", fetcher);
  
  function handleSubmit(): void {
    setFormErrors({});
    fetcher.submit(clientData, { method: "post", encType: "application/json" });
  }

  const handleClientChange = (value: string, id: string) => {
    console.log("value: ", value, "id: ", id);
    setClientData((prev) => {
      return {
        ...prev,
        [id]: value,
      };
    });
  };

  return (
    <Page
      title="Add new client"
      backAction={{ content: "All Clients", url: "/app/clients" }}
      primaryAction={{
        content: "Save",
        disabled: JSON.stringify(clientData) === JSON.stringify(data.client),
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
                  <TextField
                    label="Name"
                    id="name"
                    autoComplete="off"
                    onChange={handleClientChange}
                    value={clientData?.name}
                    error={formErrors?.name?.length > 0 ? formErrors.name[0] : undefined}
                  ></TextField> 
                  <TextField
                    label="Company"
                    id="company"
                    autoComplete="off"
                    value={clientData?.company ?? ""}
                    onChange={handleClientChange}
                  ></TextField>
                  <TextField
                    label="Email"
                    id="email"
                    autoComplete="off"
                    type="email"
                    value={clientData?.email ?? ""}
                    onChange={handleClientChange}
                  ></TextField>
                  <TextField
                    label="About"
                    id="about"
                    autoComplete="off"
                    multiline={6}
                    value={clientData?.about ?? ""}
                    onChange={handleClientChange}
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
