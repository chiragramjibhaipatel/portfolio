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
import { ActionFunctionArgs, json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { z } from "zod";
import { useFetcher, useLoaderData} from "@remix-run/react";
import { authenticate } from "~/shopify.server";
import db from "../db.server"
import {useEffect, useState} from "react";

const ClientSchema = z.object({
  name: z.string().min(3, {message: "Name must be at least 3 characters long"}),
  company: z.string().min(3, {message: "Company must be at least 3 characters long"}).nullable(),
  about: z.string().nullable().optional(),
  email: z.string().email().nullable().optional()
})

// Define the type for form errors
type FormErrors = {
  formErrors?: string[];
  fieldErrors?: Record<string, string[]>;
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const {session} = await authenticate.admin(request);

  const { id } = params;
  if(id === "add"){
    return json({client: null});
  }
  console.log("Existing Client id: ", id);
  const client = await db.client.findUnique({
    where:{
      id:id,
      sessionId: session.id
    },
    select:{
      name: true,
      company: true,
      about: true,
      email: true
    }
  })
  if(!client){
    throw new Response("Client not found", {status: 404});
  }
  console.log("Client: ", client);
  return json({ client });
};

export const action = async ({request, params} : ActionFunctionArgs)=>{
  const {session} =await authenticate.admin(request);
  console.log("params action", params);
  const formData = await request.json();
  const result = ClientSchema.safeParse(formData);

  if(!result.success){
    return json({status: "error", errors: result.error.flatten()}, {status: 400});
  }

  const {name, company, about, email} = result.data;
  let client;
  if(params.id === "add"){
    console.log("Creating new client");
    client = await db.client.create({
      data:{
        name,
        company,
        about,
        email,
        sessionId: session.id,
      }
    });
    return redirect(`/app/clients/${client.id}`);
  } else {
    console.log("Updating client: ", params.id);
    client = await db.client.update({
      where:{
        id: params.id,
        sessionId: session.id
      },
      data:{
        name,
        company,
        about,
        email,
      },
      select:{
        name: true,
        company: true,
        about: true,
        email: true
      }
    });
    return json({status: "success", client}, {status: 200});
  }
}

export default function NewClient() {
  let data = useLoaderData<typeof loader>();
  const [clientData, setClientData] = useState(data?.client );
  const [isNew, setIsNew] = useState(true);
  const [formErrors, setFormErrors] = useState<FormErrors | undefined>(undefined);
  const fetcher = useFetcher();
  const formIsLoading = ["loading", "submitting"].includes(fetcher.state);

  useEffect(() => {
    if(window.location.pathname.endsWith("/add")){
      setIsNew(true);
    } else {
      setIsNew(false);
    }
  }, [fetcher]);

  function handleSubmit(): void {
    const result = ClientSchema.safeParse(clientData);
    if(!result.success){
      console.log("Errors: ", result.error.flatten());
      setFormErrors(result.error.flatten());
      return;
    }
    setFormErrors(undefined);

    fetcher.submit(
      clientData,
      { method: "post", encType: "application/json" },
    );
  }

  const handleClientChange = (value: string, id: string) => {
    console.log("value: ", value, "id: ", id);
    // @ts-ignore
    setClientData((prev) => {
      return {
        ...prev,
        [id]: value,
      };
    });
  }

  return (
    <Page
      title={isNew ? "Add New Client" : "Edit Client"}
      backAction={{ content: "All Clients", url: "/app/clients" }}
      primaryAction={{
        content: "Save",
        disabled: JSON.stringify(data.client) === JSON.stringify(clientData),
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
                    value={clientData?.name }
                    requiredIndicator={true}
                    error={formErrors?.fieldErrors?.name?.[0]}
                  ></TextField>
                  <TextField
                    label="Company"
                    id="company"
                    autoComplete="off"
                    value={clientData?.company ?? ""}
                    onChange={handleClientChange}
                    error={formErrors?.fieldErrors?.company?.[0]}
                  ></TextField>
                  <TextField
                    label="Email"
                    id="email"
                    autoComplete="off"
                    type="email"
                    value={clientData?.email ?? ""}
                    onChange={handleClientChange}
                    error={formErrors?.fieldErrors?.email?.[0]}
                  ></TextField>
                  <TextField
                    label="About"
                    id="about"
                    autoComplete="off"
                    multiline={6}
                    value={clientData?.about ?? ""}
                    onChange={handleClientChange}
                    error={formErrors?.fieldErrors?.about?.[0]}
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
              {!isNew && (
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
              )}
            </FormLayout>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
