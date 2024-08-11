import {
  Card,
  Layout,
  Page,
  Text,
  ResourceList,
  ResourceItem,
  EmptyState,
  ResourceListProps,
  Link,
} from "@shopify/polaris";
import { useState } from "react";
import { DeleteIcon } from "@shopify/polaris-icons";
import {json, LoaderFunctionArgs} from "@remix-run/node";
import { authenticate } from "~/shopify.server";
import db from "~/db.server";
import {useLoaderData} from "@remix-run/react";

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

export default function ClientsPage() {
  const {clients} = useLoaderData<typeof  loader>();
  const [selectedItems, setSelectedItems] = useState<
    ResourceListProps["selectedItems"]
  >([]);

    const bulkActions = [
      {
        icon: DeleteIcon,
        destructive: true,
        content: "Delete customers",
        onAction: () => console.log("Todo: implement bulk delete"),
      },
    ];

  const emptyStateMarkup = !clients.length ? (
    <EmptyState
      heading="There is no client in the database"
      action={{ content: "Add Client", url: "/app/clients/add" }}
      image="https://cdn.shopify.com/s/files/1/2376/3301/products/emptystate-files.png"
    >
      <p>
        You can add all the details of your current and past clients here. You
        can also edit them afterworkds.
      </p>
    </EmptyState>
  ) : undefined;

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
            ></ResourceList>
          </Card>
        </Layout.AnnotatedSection>
      </Layout>
    </Page>
  );
}

function renderItem(item: any) {
  const { id, name, company } = item;
  return (
    <ResourceItem
      id={id}
      url="#"
      accessibilityLabel={`View details for ${name}`}
      name={name}
    >
      <Text variant="bodyMd" fontWeight="bold" as="h3">
        {name} - <span style={{fontStyle: "italic", fontWeight:"300"}}>{company}</span>
      </Text>
    </ResourceItem>
  );
}
