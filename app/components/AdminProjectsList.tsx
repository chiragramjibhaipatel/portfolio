import {
  Avatar,
  Badge,
  BadgeStatusValue,
  BlockStack,
  Box,
  Button,
  CalloutCard,
  Card,
  ChoiceList,
  EmptyState,
  Filters,
  FiltersProps,
  InlineGrid,
  InlineStack,
  ResourceList,
  Text,
  TextField,
} from "@shopify/polaris";
import { useCallback, useEffect, useState } from "react";
import type { Project } from "@prisma/client";
import { useFetcher } from "@remix-run/react";
import { PlusIcon } from "@shopify/polaris-icons";

type ProjectSummary = Pick<
  Project,
  "id" | "title" | "description" | "status" | "storeUrl"
> & {
  client: {
    name: string | null;
    company: string | null;
  };
};

// Use the new type as the prop type
type AdminProjectsListProps = {
  allProjects: ProjectSummary[];
};

export function AdminProjectsList({ allProjects }: AdminProjectsListProps) {
  const emptyFilterState: {
    query: {
      label: string;
      value: "";
    };
    projectStatus: {
      label: string;
      value: string[];
    };
    taggedWith: {
      label: string;
      value: "";
    };
  } = {
    query: {
      label: "Search",
      value: "",
    },
    projectStatus: {
      label: "Project status",
      value: [],
    },
    taggedWith: {
      label: "Tagged with",
      value: "",
    },
  };

  const [projects, setProjects] = useState(allProjects);
  useEffect(() => {
    setProjects(allProjects);
  }, [allProjects]);
  const [queryValue, setQueryValue] = useState("");
  const [taggedWith, setTaggedWith] = useState("");
  const [projectStatus, setProjectStatus] = useState<string[]>([]);
  const [savedFilterState, setSavedFilterState] = useState<
    Map<
      string,
      {
        label: string;
        value: string | string[] | number | [number, number];
      }
    >
  >(new Map(Object.entries(emptyFilterState)));

  const [selectedIProjects, setSelectedIProjects] = useState<string[] | "All">(
    [],
  );
  let fetcherDeleteProjects = useFetcher({ key: "deleteProjects" });

  const formIsLoading = ["loading", "submitting"].includes(
    fetcherDeleteProjects.state,
  );
  console.log("Selected Items: ", selectedIProjects);

  useEffect(() => {
    if (fetcherDeleteProjects.data?.status === "success") {
      setSelectedIProjects([]);
    }
  }, [fetcherDeleteProjects.data]);

  const handleDeleteProjects = () => {
    if (selectedIProjects && selectedIProjects?.length === 0) return;
    console.log(selectedIProjects);
    fetcherDeleteProjects.submit(
      { selectedIProjects },
      { method: "POST", encType: "application/json" },
    );
  };

  const promotedBulkActions = [
    {
      content: "Delete projects",
      onAction: handleDeleteProjects,
      variant: "danger",
    },
  ];

  useEffect(() => {
    //first filter by query
    let filteredProjectsList = allProjects.filter(
      (project) =>
        project.title.toLowerCase().includes(queryValue.toLowerCase()) ||
        project.description?.toLowerCase().includes(queryValue.toLowerCase()) ||
        project.client.name?.toLowerCase().includes(queryValue.toLowerCase()) ||
        project.client.company
          ?.toLowerCase()
          .includes(queryValue.toLowerCase()) ||
        project.storeUrl?.toLowerCase().includes(queryValue.toLowerCase()),
    );

    if (projectStatus.length === 0) {
      setProjects(filteredProjectsList);
    } else {
      setProjects(
        filteredProjectsList.filter((project) =>
          projectStatus.includes(project.status),
        ),
      );
    }
  }, [projectStatus, queryValue]);

  const handleFilterChange =
    (key: string) => (value: string | string[] | number | [number, number]) => {
      if (key === "taggedWith") setTaggedWith(value as string);
      if (key === "projectStatus") setProjectStatus(value as string[]);
    };

  const handleFilterRemove = (key: string) => {
    if (key === "taggedWith") {
      setTaggedWith(emptyFilterState.taggedWith.value);
    } else if (key === "projectStatus") {
      setProjectStatus(emptyFilterState.projectStatus.value);
    }
  };

  const handleFiltersQueryChange = (value: string) => setQueryValue(value);

  const handleQueryValueRemove = useCallback(() => setQueryValue(""), []);

  const handleFiltersClearAll = () => {
    Object.entries(emptyFilterState).forEach(([key]) =>
      handleFilterRemove(key),
    );

    handleQueryValueRemove();
  };

  const filters = [
    {
      key: "projectStatus",
      label: "Project status",
      value: projectStatus,
      filter: (
        <ChoiceList
          title="Project status"
          titleHidden
          choices={[
            { label: "Open", value: "OPEN" },
            { label: "In Progress", value: "IN_PROGRESS" },
            { label: "Done", value: "DONE" },
          ]}
          selected={projectStatus}
          onChange={handleFilterChange("projectStatus")}
          allowMultiple
        />
      ),
      shortcut: true,
      pinned: true,
    },
    {
      key: "taggedWith",
      label: "Tagged with",
      value: taggedWith,
      filter: (
        <TextField
          label="Tagged with"
          value={taggedWith}
          onChange={handleFilterChange("taggedWith")}
          placeholder="to be implemented"
          autoComplete="off"
          labelHidden
        />
      ),
      shortcut: true,
      pinned: true,
    },
  ];

  const appliedFilters: FiltersProps["appliedFilters"] = [];

  filters.forEach(({ key, label, value }) => {
    if (!isEmpty(value)) {
      appliedFilters.push({
        key,
        label: `${label}: ${humanReadableValue(key, value)}`,
        unsavedChanges: !isUnchanged(key, value),
        onRemove: () => handleFilterRemove(key),
      });
    }
  });

  const handleSaveFilters = () => {
    const nextSavedFilterState = new Map(savedFilterState);
    appliedFilters.forEach(({ key, unsavedChanges }) => {
      const savedFilter = nextSavedFilterState.get(key);
      const value = filters.find((filter) => filter.key === key)?.value;
      console.log(`Saving filter: ${key}, ${value}`, savedFilter);

      if (value && unsavedChanges && savedFilter) {
        savedFilter.value = value;
      }
    });

    setSavedFilterState(nextSavedFilterState);
  };

  const disableAction = appliedFilters.every(
    ({ unsavedChanges }) => !unsavedChanges,
  );

  const emptyStateMarkup = !allProjects.length ? (
    <EmptyState
      heading="Add your first project"
      action={{ content: "Add", url: "/app/projects/add", icon: PlusIcon }}
      image="https://cdn.shopify.com/s/files/1/2376/3301/products/emptystate-files.png"
    >
      <p>
        You can add projects to showcase your work. Add a project to get
        started. You can always edit or delete it later.
      </p>
    </EmptyState>
  ) : undefined;

  return (
    <BlockStack gap={"2000"}>
      <CalloutCard
        title={"This is a place where you can manage all your projects"}
        children="feel free to add more projects, edit or delete them. You can also search for a specific project using the search bar in the table below. Projects added here will be displayed on your portfolio page. You can choose if you want to hide a project from the portfolio page"
        primaryAction={{
          content: "Add Project",
          url: "/app/projects/add",
          icon: PlusIcon,
        }}
        secondaryAction={{ content: "Add Clients", url: "/app/clients/add" }}
        illustration="https://cdn.shopify.com/s/assets/admin/checkout/settings-customizecart-705f57c725ac05be5a34ec20c05b94298cb8afd10aac7bd9c7ad02030f48cfa0.svg"
      />

      <Card roundedAbove="sm" padding={"0"}>
        <ResourceList
          loading={formIsLoading}
          emptyState={emptyStateMarkup}
          resourceName={{ singular: "project", plural: "projects" }}
          selectedItems={selectedIProjects}
          onSelectionChange={setSelectedIProjects}
          promotedBulkActions={promotedBulkActions}
          filterControl={
            <Filters
              queryValue={queryValue}
              queryPlaceholder="Searching in all projects"
              filters={filters}
              appliedFilters={appliedFilters}
              onQueryChange={handleFiltersQueryChange}
              onQueryClear={handleQueryValueRemove}
              onClearAll={handleFiltersClearAll}
            >
              <Box paddingInlineStart="200">
                <Button
                  disabled={disableAction}
                  onClick={handleSaveFilters}
                  size="micro"
                  variant="tertiary"
                >
                  Save
                </Button>
              </Box>
            </Filters>
          }
          flushFilters
          items={projects}
          renderItem={renderItem}
        />
      </Card>
    </BlockStack>
  );

  function humanReadableValue(
    key: string,
    value: string | string[] | number | [number, number],
  ): string {
    if (isEmpty(value)) return "";

    switch (key) {
      case "moneySpent": {
        const [min, max] = value as [number, number];
        if (min === 0 && max === 0) return "";
        if (min === 0) return `up to $${max}`;
        if (max === 0) return `more than $${min}`;
        return `between $${min} and $${max}`;
      }

      case "taggedWith": {
        const tags = (value as string).trim().split(",");
        if (tags.length === 1) return ` ${tags[0]}`;
        else if (tags.length === 2) return `${tags[0]} and ${tags[1]}`;
        return tags
          .map((tag, index) => {
            return index !== tags.length - 1 ? tag : `and ${tag}`;
          })
          .join(", ");
      }
      case "projectStatus": {
        const statuses = value as string[];
        if (statuses.length === 1) {
          return statuses[0];
        } else if (statuses.length === 2) {
          return `${statuses[0]} or ${statuses[1]}`;
        } else {
          return statuses
            .map((status, index) => {
              return index !== statuses.length - 1 ? status : `or ${status}`;
            })
            .join(", ");
        }
      }
      default:
        return "";
    }
  }

  function isEmpty(value: string | string[] | number | [number, number]) {
    if (Array.isArray(value)) {
      return value.length === 0 || value[1] === 0;
    } else {
      return value === "" || value === 0 || value == null;
    }
  }

  function isUnchanged(
    key: string,
    value: string | string[] | number | [number, number],
  ) {
    if (key === "taggedWith") {
      return value === savedFilterState.get(key)?.value;
    } else if (key === "moneySpent") {
      const [min, max] = value as [number, number];
      const savedMoneySpent = savedFilterState.get(key)?.value as [
        number,
        number,
      ];

      return min === savedMoneySpent?.[0] && max === savedMoneySpent?.[1];
    } else if (key === "projectStatus") {
      const savedProjectStatus =
        (savedFilterState.get(key)?.value as string[]) || [];
      return (
        Array.isArray(value) &&
        (value as string[]).every((val) =>
          savedProjectStatus?.includes(val as string),
        )
      );
    }
  }

  function renderItem(item: ProjectSummary) {
    const {
      id,
      description,
      title,
      status,
      storeUrl,
      client: { name, company },
    } = item;
    const media = (
      <Avatar
        initials={title
          .split(" ")
          .map((nm) => nm.substring(0, 1))
          .join("")}
        size="md"
        name={title}
      />
    );
    let badgeTone;
    if (status === "OPEN") badgeTone = BadgeStatusValue.Info;
    else if (status === "IN_PROGRESS") badgeTone = BadgeStatusValue.Warning;
    else if (status === "DONE") badgeTone = BadgeStatusValue.New;

    return (
      <ResourceList.Item
        id={id}
        url={`/app/projects/${id}`}
        media={media}
        accessibilityLabel={`View details for ${title}`}
        shortcutActions={[
          {
            content: "Edit project",
            url: `/app/projects/${id}`,
          },
        ]}
      >
        <InlineGrid columns={3} gap={"200"}>
          <Box>
            <Text as="h3" fontWeight="bold">
              {highlightText(title)}
            </Text>
            <div>{highlightText(description)}</div>
          </Box>
          <Box>
            <Text as="h4">
              {highlightText(name)} -{" "}
              <div style={{ fontStyle: "italic", display: "inline" }}>
                {highlightText(company)}
              </div>
            </Text>
            <InlineStack gap={"100"} wrap={false}>
              {storeUrl && (
                <Badge
                  tone={BadgeStatusValue.New}
                  children={highlightText(storeUrl)}
                />
              )}
              <Badge
                tone={badgeTone}
                progress={
                  status === "IN_PROGRESS" ? "partiallyComplete" : undefined
                }
              >
                {status === "IN_PROGRESS"
                  ? "In Progress"
                  : status === "OPEN"
                    ? "Open"
                    : status === "DONE"
                      ? "Done"
                      : ""}
              </Badge>
            </InlineStack>
          </Box>
        </InlineGrid>
      </ResourceList.Item>
    );
  }

  function highlightText(text: string | null) {
    if (!text) return "";
    if (!queryValue) return text;
    const parts = text.split(new RegExp(`(${queryValue})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === queryValue.toLowerCase() ? (
        <span key={index} className="highlight">
          {part}
        </span>
      ) : (
        part
      ),
    );
  }
}
