import {
  BlockStack, Box,
  Button,
  CalloutCard,
  Card,
  EmptyState,
  InlineStack,
  Layout,
  Link,
  Page,
  ResourceItem,
  ResourceList,
  Tag,
  Text,
} from "@shopify/polaris";
import { useEffect, useState } from "react";
import { DeleteIcon } from "@shopify/polaris-icons";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { authenticate } from "~/shopify.server";
import db from "~/db.server";
import { useFetcher, useLoaderData, useRouteError } from "@remix-run/react";
import { Prisma } from "@prisma/client";

//todo: handle  Foreign key constraint failed on the field: `Project_clientId_fkey (index)` when deleting a client that has projects

export const loader = async ({ request }: LoaderFunctionArgs) => {
  let { session } = await authenticate.admin(request);
  const clients = await db.client.findMany({
    where: {
      sessionId: session.id,
    },
    select: {
      id: true,
      name: true,
      company: true,
      about: true,
    },
    take: 5,
  });

  return json({ clients });
};

const pleaseDeleteTheProjectsFirst =
  "An error occurred while deleting the client. Some of the clients might have projects associated with them. Please delete the projects first.";
const somethingWentWrongWhileDeletingTheClient =
  "Something went wrong while deleting the client";
export const action = async ({ request }: LoaderFunctionArgs) => {
  let { session } = await authenticate.admin(request);
  let { selectedItems } = await request.json();
  console.log("Selected Items: ", selectedItems);
  try {
    await db.client.deleteMany({
      where: {
        sessionId: session.id,
        id: {
          in: selectedItems,
        },
      },
    });
    return json({ status: "success" });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (error.code === "P2003") {
        console.log(
          "There is a unique constraint violation, a new user cannot be created with this email",
        );
        throw new Error(pleaseDeleteTheProjectsFirst);
      }
    }
    throw new Error(somethingWentWrongWhileDeletingTheClient);
  }
};

function EmptyStateMarkup() {
  return (
    <EmptyState
      heading="There is no client in the database"
      action={{ content: "Add Client", url: "/app/clients/add" }}
      image="https://cdn.shopify.com/s/files/1/2376/3301/products/emptystate-files.png"
    >
      <Text as={"p"}>
        You can add all the details of your current and past clients here. You
        can also edit them afterword.
      </Text>
    </EmptyState>
  );
}

export default function ClientsPage() {
  const { clients } = useLoaderData<typeof loader>();
  const [selectedItems, setSelectedItems] = useState<string[] | "All">([]);
  let fetcher = useFetcher<typeof action>();
  const formIsLoading = ["loading", "submitting"].includes(fetcher.state);
  console.log("Selected Items: ", selectedItems);

  let handleDeleteClient = async () => {
    fetcher.submit(
      { selectedItems: selectedItems },
      {
        method: "POST",
        encType: "application/json",
      },
    );
  };

  useEffect(() => {
    if (fetcher.data?.status === "success") {
      setSelectedItems([]);
    }
  }, [fetcher.data]);

  const bulkActions = [
    {
      icon: DeleteIcon,
      destructive: true,
      content: `Delete ${selectedItems.length} ${selectedItems.length > 1 ? "clients" : "client"}`,
      onAction: handleDeleteClient,
    },
  ];

  const emptyStateMarkup = !clients.length ? <EmptyStateMarkup /> : undefined;

  const fetcherHandleAddClients = useFetcher({ key: "addClients" });

  function handleAddClients() {
    fetcherHandleAddClients.submit(
      {},
      { action: "/api/clients/add", method: "POST" },
    );
  }

  return (
    <Page>
      <Layout>
        <Layout.AnnotatedSection
          id="all_clients"
          title="All Clients"
          description="Add/Update/Delete your clients and the stores connected to them"
        >
          <Card>
            <ResourceList
              emptyState={emptyStateMarkup}
              resourceName={{ singular: "client", plural: "clients" }}
              items={clients}
              renderItem={renderItem}
              selectedItems={selectedItems}
              onSelectionChange={setSelectedItems}
              selectable
              alternateTool={<Link url="/app/clients/add">Add</Link>}
              bulkActions={bulkActions}
              loading={formIsLoading}
            ></ResourceList>
          </Card>
        </Layout.AnnotatedSection>
        <Layout.AnnotatedSection
          id="add_clients"
          title="Add Clients"
          description="Add a new client to the database"
        >
          <Card>
            <InlineStack align={"space-between"}>
              <Text as={"h2"}>Add some clients</Text>
              <Button
                variant={"primary"}
                onClick={handleAddClients}
                loading={["loading", "submitting"].includes(
                  fetcherHandleAddClients.state,
                )}
              >
                Add Client
              </Button>
            </InlineStack>
          </Card>
        </Layout.AnnotatedSection>
      </Layout>
    </Page>
  );
}

function renderItem(item: any) {
  const { id, name, company } = item;
  console.log("Item", item);
  return (
    <ResourceItem
      id={id}
      url="#"
      accessibilityLabel={`View details for ${name}`}
      name={name}
      shortcutActions={[{ content: "Edit", url: `/app/clients/${id}` }]}
      verticalAlignment="leading"
    >
      <Text variant="bodyMd" fontWeight="bold" as="h3">
        {name} -{" "}
        <span style={{ fontStyle: "italic", fontWeight: "300" }}>
          {company}
        </span>
        <div>
          <Tag>tasks: 3</Tag>
        </div>
      </Text>
    </ResourceItem>
  );
}

// export ErrorBoundary
export function ErrorBoundary() {
  let errorTitle;
  let routeError = useRouteError() as Error;
  const foreignKeyError = routeError.message === pleaseDeleteTheProjectsFirst;
  const somethingWentWrongError =
    routeError.message === somethingWentWrongWhileDeletingTheClient;
  if (!foreignKeyError && !somethingWentWrongError) {
    errorTitle = "Something is definitely wrong";
  } else if (foreignKeyError) {
    errorTitle = "Cannot delete client";
  } else if (somethingWentWrongError) {
    errorTitle = "Something went wrong while deleting the client";
  }
  return (
    <BlockStack inlineAlign={"center"} align={"center"} >
      <Box paddingBlockStart={"2000"}>
        <CalloutCard
          title={errorTitle}
          illustration="https://cdn.shopify.com/s/assets/admin/checkout/settings-customizecart-705f57c725ac05be5a34ec20c05b94298cb8afd10aac7bd9c7ad02030f48cfa0.svg"
          primaryAction={{ content: "Go back to clients list", url: "/app/clients" }}
          secondaryAction={{ content: "Go to Projects", url: "/app" }}
        >
          <p>{routeError.message}</p>
        </CalloutCard>
      </Box>
    </BlockStack>
  );
}
