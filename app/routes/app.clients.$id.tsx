import {
  BlockStack,
  Box,
  Button,
  Card,
  DropZone,
  FormLayout,
  InlineGrid,
  InlineStack,
  Layout,
  List,
  Page,
  Spinner,
  Tag,
  Text,
  TextField,
} from "@shopify/polaris";
import {ActionFunctionArgs, json, LoaderFunctionArgs, redirect} from "@remix-run/node";
import {z} from "zod";
import {useFetcher, useLoaderData} from "@remix-run/react";
import {authenticate} from "~/shopify.server";
import db from "../db.server"
import {useCallback, useEffect, useState} from "react";

const ClientSchema = z.object({
  name: z.string().min(3, {message: "Name must be at least 3 characters long"}),
  company: z.string().min(3, {message: "Company must be at least 3 characters long"}).nullable().optional(),
  about: z.string().nullable().optional(),
  email: z.string().email().nullable().optional(),
  stores: z.array(z.string()).optional(),
  imageUrl: z.string().nullable().optional()
})

// Define the type for form errors
type FormErrors = {
  formErrors?: string[];
  fieldErrors?: Record<string, string[]>;
};

export const loader = async ({request, params}: LoaderFunctionArgs) => {
  const {session} = await authenticate.admin(request);

  const {id} = params;
  if (id === "add") {
    return json({client: null});
  }
  console.log("Existing Client id: ", id);
  const client = await db.client.findUnique({
    where: {
      id: id,
      sessionId: session.id
    },
    select: {
      name: true,
      company: true,
      about: true,
      email: true,
      stores: true,
      imageUrl: true
    }
  })
  if (!client) {
    throw new Response("Client not found", {status: 404});
  }
  console.log("Client: ", client);
  return json({client});
};

export const action = async ({request, params}: ActionFunctionArgs) => {
  const {session} = await authenticate.admin(request);
  console.log("params action", params);
  const formData = await request.json();
  const result = ClientSchema.safeParse(formData);

  if (!result.success) {
    return json({status: "error", errors: result.error.flatten()}, {status: 400});
  }

  const {name, company, about, email, stores, imageUrl} = result.data;
  let client;
  if (params.id === "add") {
    console.log("Creating new client");
    client = await db.client.create({
      data: {
        name,
        company,
        about,
        email,
        sessionId: session.id,
        stores,
        imageUrl
      }
    });
    return redirect(`/app/clients/${client.id}`);
  } else {
    console.log("Updating client: ", params.id);
    client = await db.client.update({
      where: {
        id: params.id,
        sessionId: session.id
      },
      data: {
        name,
        company,
        about,
        email,
        stores,
        imageUrl
      },
      select: {
        name: true,
        company: true,
        about: true,
        email: true,
        stores: true,
        imageUrl: true
      }
    });
    return json({status: "success", client}, {status: 200});
  }
}


export default function NewClient() {
  let data = useLoaderData<typeof loader>();
  const [clientData, setClientData] = useState(data?.client);
  const [isNew, setIsNew] = useState(true);
  const [formErrors, setFormErrors] = useState<FormErrors | undefined>(undefined);
  const fetcher = useFetcher();
  const [storeUrl, setStoreUrl] = useState<string | undefined>()
  const [storeUrlFocus, setStoreUrlFocus] = useState<boolean | undefined>()

  const formIsLoading = ["loading", "submitting"].includes(fetcher.state);

  useEffect(() => {
    if (window.location.pathname.endsWith("/add")) {
      setIsNew(true);
    } else {
      setIsNew(false);
    }
  }, [fetcher]);

  function handleSubmit(): void {
    const result = ClientSchema.safeParse(clientData);
    if (!result.success) {
      console.log("Errors: ", result.error.flatten());
      setFormErrors(result.error.flatten());
      return;
    }
    setFormErrors(undefined);

    fetcher.submit(
      clientData,
      {method: "post", encType: "application/json"},
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

  function handleAddStoreUrl() {
    // @ts-ignore
    setClientData((prev) => {
      if (prev === null) {
        return {
          stores: [storeUrl]
        }
      } else if (!prev.stores) {
        return {
          ...prev,
          stores: [storeUrl]
        }
      }
      return {
        ...prev,
        stores: [...new Set([...prev?.stores, storeUrl])]
      }
    });
    setStoreUrl("");
    setStoreUrlFocus(true)

  }

  function handleStoreUrlChange(value: string) {
    setStoreUrl(value);
  }

  function handleSetImageUrl(imageUrl: string) {
    // @ts-ignore
    setClientData((prev) => {
      return {
        ...prev,
        imageUrl
      }
    });
  }

  const handleRemoveStoreUrl = useCallback(
    (store: string) => () => {
      // @ts-ignore
      setClientData((prev) => {
        if (prev === null) {
          return {
            stores: []
          }
        }
        return {
          ...prev,
          stores: prev.stores.filter(s => s !== store)
        }
      });
    },
    [],
  );

  return (
    <Page
      title={isNew ? "Add New Client" : "Edit Client"}
      backAction={{content: "All Clients", url: "/app/clients"}}
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
                    value={clientData?.name}
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
                  <TextField label="Store Url"
                             focused={storeUrlFocus}
                             autoComplete="off"
                             value={storeUrl}
                             onBlur={() => setStoreUrlFocus(false)}
                             type={"url"}
                             onChange={handleStoreUrlChange}
                             connectedRight={<Button onClick={handleAddStoreUrl}
                                                     disabled={storeUrl?.length === 0}>Add</Button>}
                             prefix={"https://"}>
                  </TextField>
                  <InlineStack gap={"200"}>
                    {clientData?.stores?.map(store => (
                      <Tag onRemove={handleRemoveStoreUrl(store)} key={store} url={`https://${store}`}>{store}</Tag>
                    ))}
                  </InlineStack>
                </FormLayout>
              </Card>
            </BlockStack>
          </Layout.Section>
          <Layout.Section variant="oneThird">
            <FormLayout>
              <ClientImageUploader imageUrl={clientData?.imageUrl} handleSetImageUrl={handleSetImageUrl}/>
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

function ClientImageUploader({imageUrl, handleSetImageUrl}: {
  imageUrl?: string | null,
  handleSetImageUrl: (imageUrl: string) => void
}) {

  let fetcherFileUpload = useFetcher<{imageUrl: string}>({key: "fileUpload"});
  const fetcherFileUploadLoading = ["loading", "submitting"].includes(fetcherFileUpload.state);

  const [file, setFile] = useState<File>();
  const [openFileDialog, setOpenFileDialog] = useState(false);

  const toggleOpenFileDialog = useCallback(
    () => setOpenFileDialog((openFileDialog) => !openFileDialog),
    [],
  );

  useEffect(() => {
    if (fetcherFileUpload.state === "idle" && fetcherFileUpload.data?.imageUrl) {
      console.log("File uploaded successfully", fetcherFileUpload
        .data);
      handleSetImageUrl(fetcherFileUpload.data.imageUrl);
      fetcherFileUpload.load("/api/reset")
    }
  }, [fetcherFileUpload])

  const handleDropZoneDrop = useCallback(
    (_dropFiles: File[], acceptedFiles: File[], _rejectedFiles: File[]) => {
      console.log("Accepted Files: ", acceptedFiles);
      let formData = new FormData();
      formData.append("file", acceptedFiles[0]);
      fetcherFileUpload.submit(formData, {action: "/api/image/upload", method: "POST", encType: "multipart/form-data"});
      setFile(acceptedFiles[0])
    },
    [],
  );

  const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];

  const fileUpload = (!file && !imageUrl) && <DropZone.FileUpload actionTitle={"Upload"}/>;
  const uploadedFile = fetcherFileUploadLoading ?
    (
      <InlineStack blockAlign={"center"} align={"center"}>
        <Spinner accessibilityLabel="Image is being uploaded" size="small"/>
      </InlineStack>
    ) :
    (
      <InlineStack>
        <img
          style={{maxWidth: "100%", borderRadius: "7px"}}
          src={
            (file && validImageTypes.includes(file.type))
              ? window.URL.createObjectURL(file)
              : imageUrl ?? ""
          }/>
      </InlineStack>
    );

  return (
    <Card>
      <BlockStack gap={"100"}>
        <InlineGrid columns="1fr auto">
          <Text as="h2" variant="bodyMd">
            Logo/Image
          </Text>
          {(file || imageUrl) && <Button onClick={toggleOpenFileDialog} variant={"plain"}>Change</Button>}
        </InlineGrid>
        <DropZone disabled={fetcherFileUploadLoading} allowMultiple={false} onDrop={handleDropZoneDrop}
                  openFileDialog={openFileDialog}
                  onFileDialogClose={toggleOpenFileDialog}>
          {uploadedFile}
          {fileUpload}
        </DropZone>
      </BlockStack>
    </Card>
  );
}
