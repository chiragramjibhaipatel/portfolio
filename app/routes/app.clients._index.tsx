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
import { clients } from "~/data/custom_data";
import { useState } from "react";
import { DeleteIcon } from "@shopify/polaris-icons";
import { LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "~/shopify.server";

export const loader = async ({request}: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  return {};
}

export default function ClientsPage() {
  const [selectedItems, setSelectedItems] = useState<
    ResourceListProps["selectedItems"]
  >([]);
  let data = clients;

    const bulkActions = [
      {
        icon: DeleteIcon,
        destructive: true,
        content: "Delete customers",
        onAction: () => console.log("Todo: implement bulk delete"),
      },
    ];

  const emptyStateMarkup = !data.length ? (
    <EmptyState
      heading="There is no client in the database"
      action={{ content: "Add Client" }}
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
              items={data}
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
