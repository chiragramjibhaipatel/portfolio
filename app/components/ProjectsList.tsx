import {
  Card,
  ResourceList,
  Avatar,
  ResourceItem,
  Text,
} from "@shopify/polaris";

export function ProjectsList({
  data,
  projects,
}: {
  data: Data[];
  projects: {
    id: string;
    title: string;
    description: string | null;
    testimonial: string | null;
    client: { imageUrl: string | null; name: string };
  }[];
}) {
  return (
    <Card>
      <ResourceList
        resourceName={{
          singular: "project",
          plural: "projects",
        }}
        items={projects}
        renderItem={(item) => {
          const { id, title, description, client } = item;
          const media = (
            <Avatar
              customer
              size="md"
              name={client?.name}
              source={client.imageUrl || undefined}
            />
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
              <div>{description?.substring(0, 200)}...</div>
            </ResourceItem>
          );
        }}
      />
    </Card>
  );
}
