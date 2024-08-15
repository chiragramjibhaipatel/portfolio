import {
  Card,
  Layout,
  Page,
  Text,
  ResourceList,
  ResourceItem,
  EmptyState,
  Link, Tag, Button, InlineStack,
} from "@shopify/polaris";
import {useEffect, useState} from "react";
import {DeleteIcon} from "@shopify/polaris-icons";
import {json, LoaderFunctionArgs} from "@remix-run/node";
import {authenticate} from "~/shopify.server";
import db from "~/db.server";
import {useFetcher, useLoaderData} from "@remix-run/react";

export const loader = async ({request}: LoaderFunctionArgs) => {
  let {session} = await authenticate.admin(request);
  const clients = await db.client.findMany({
    where: {
      sessionId: session.id
    },
    select: {
      id: true,
      name: true,
      company: true,
      about: true,
    }
  })

  return json({clients});
}

export const action = async ({request}: LoaderFunctionArgs) => {
  let {session} = await authenticate.admin(request);
  let {selectedItems} = await request.json();
  console.log("Selected Items: ", selectedItems);
  await db.client.deleteMany({
    where: {
      sessionId: session.id,
      id: {
        in: selectedItems
      }
    }
  });
  return json({status: "success"});
}


export default function ClientsPage() {
  const {clients} = useLoaderData<typeof loader>();
  const [selectedItems, setSelectedItems] = useState<string[] | "All">([]);
  let fetcher = useFetcher<typeof action>();
  const formIsLoading = ["loading", "submitting"].includes(fetcher.state);
  console.log("Selected Items: ", selectedItems);

  let handleDeleteClient = async () => {
    fetcher.submit({selectedItems: selectedItems}, {
      method: "POST", encType: "application/json",
    })
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

  const emptyStateMarkup = !clients.length ? (
    <EmptyStateMarkup/>
  ) : undefined;

  const fetcherHandleAddClients = useFetcher({key: "addClients"});

  function handleAddClients() {
    fetcherHandleAddClients.submit({}, {action: "/api/clients/add", method: "POST"});
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
              resourceName={{singular: "client", plural: "clients"}}
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
              <Button variant={"primary"} onClick={handleAddClients}
                      loading={["loading", "submitting"].includes(fetcherHandleAddClients.state)}>Add Client</Button>
            </InlineStack>
          </Card>
        </Layout.AnnotatedSection>
      </Layout>
    </Page>
  );
}

function renderItem(item: any) {
  const {id, name, company} = item;
  return (
    <ResourceItem
      id={id}
      url="#"
      accessibilityLabel={`View details for ${name}`}
      name={name}
      shortcutActions={[{content: "Edit", url: `/app/clients/${id}`}]}
      verticalAlignment="leading"
    >
      <Text variant="bodyMd" fontWeight="bold" as="h3">
        {name} - <span style={{fontStyle: "italic", fontWeight: "300"}}>{company}</span>
        <div><Tag>tasks: 3</Tag></div>
      </Text>
    </ResourceItem>
  );
}

function EmptyStateMarkup() {
  return <EmptyState
    heading="There is no client in the database"
    action={{content: "Add Client", url: "/app/clients/add"}}
    image="https://cdn.shopify.com/s/files/1/2376/3301/products/emptystate-files.png"
  >
    <p>
      You can add all the details of your current and past clients here. You
      can also edit them afterword.
    </p>
  </EmptyState>;
}
