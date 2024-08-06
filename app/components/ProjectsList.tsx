import { Card, ResourceList, Avatar, ResourceItem, Text} from "@shopify/polaris";

export function ProjectsList({ data }: { data: Data[]; }) {
  return (
    <Card>
      <ResourceList
        resourceName={{
          singular: "project",
          plural: "projects",
        }}
        items={data}
        renderItem={(item) => {
          const { id, title, description, shop, client, logo } = item;
          const media = (
            <Avatar customer size="md" name={client?.name} source={logo.url} />
          );
          return (
            <ResourceItem
              id={id}
              url={"/portfolio/" + id}
              media={media}
              accessibilityLabel={`View details for ${title}`}
            >
              <Text variant="headingMd" as="h4">
                {title}
              </Text>
              <div>{description.substring(0, 200)}...</div>
            </ResourceItem>
          );
        }} />
    </Card>
  );
}
