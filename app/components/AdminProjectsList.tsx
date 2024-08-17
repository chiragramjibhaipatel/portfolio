import type { FiltersProps } from "@shopify/polaris";
import {
  Avatar,
  Box,
  Button,
  Card,
  ChoiceList,
  Filters,
  RangeSlider,
  ResourceList,
  Text,
  TextField,
} from "@shopify/polaris";
import { useCallback, useEffect, useState } from "react";

let items = [
  {
    id: "341",
    url: "#",
    name: "Mae Jemison",
    location: "Decatur, USA",
    title: "Quantity Breaks",
    description: "Shopify Plus, Shopify",
    status: "Open",
    client: {
      name: "Eugen",
      imageUrl:
        "https://cdn.shopify.com/s/files/1/0262/4071/2726/files/Avatar_1_80x80.png?v=1617631864",
    },
    shopifyPlan: "Shopify Plus",
  },
  {
    id: "342",
    url: "#",
    name: "Neil Armstrong",
    location: "Wapakoneta, USA",
    title: "Space Exploration",
    description: "Shopify Plus, Shopify",
    status: "IN_PROGRESS",
    client: {
      name: "Buzz",
      imageUrl:
        "https://cdn.shopify.com/s/files/1/0262/4071/2726/files/Avatar_2_80x80.png?v=1617631864",
    },
    shopifyPlan: "Shopify Advanced",
  },
  {
    id: "343",
    url: "#",
    name: "Sally Ride",
    location: "Encino, USA",
    title: "STEM Education",
    description: "Shopify Plus, Shopify",
    status: "Done",
    client: {
      name: "Chris",
      imageUrl:
        "https://cdn.shopify.com/s/files/1/0262/4071/2726/files/Avatar_3_80x80.png?v=1617631864",
    },
    shopifyPlan: "Shopify",
  },
  {
    id: "344",
    url: "#",
    name: "Yuri Gagarin",
    location: "Klushino, Russia",
    title: "First in Space",
    description: "Shopify Plus, Shopify",
    status: "Open",
    client: {
      name: "Valentina",
      imageUrl:
        "https://cdn.shopify.com/s/files/1/0262/4071/2726/files/Avatar_4_80x80.png?v=1617631864",
    },
    shopifyPlan: "Shopify Plus",
  },
  {
    id: "345",
    url: "#",
    name: "Buzz Aldrin",
    location: "Glen Ridge, USA",
    title: "Moon Landing",
    description: "Shopify Plus, Shopify",
    status: "In Progress",
    client: {
      name: "Michael",
      imageUrl:
        "https://cdn.shopify.com/s/files/1/0262/4071/2726/files/Avatar_5_80x80.png?v=1617631864",
    },
    shopifyPlan: "Shopify Advanced",
  },
  {
    id: "346",
    url: "#",
    name: "John Glenn",
    location: "Cambridge, USA",
    title: "Orbital Flight",
    description: "Shopify Plus, Shopify",
    status: "Done",
    client: {
      name: "Scott",
      imageUrl:
        "https://cdn.shopify.com/s/files/1/0262/4071/2726/files/Avatar_6_80x80.png?v=1617631864",
    },
    shopifyPlan: "Shopify",
  },
];

export function AdminProjectsList() {
  const emptyFilterState: {
    query: {
      label: string;
      value: "";
    };
    projectStatus: {
      label: string;
      value: string[];
    };
    moneySpent: {
      label: string;
      value: [number, number];
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
    moneySpent: {
      label: "Money spent",
      value: [0, 0],
    },
    taggedWith: {
      label: "Tagged with",
      value: "",
    },
  };

  const [projects, setProjects] = useState(items);
  const [queryValue, setQueryValue] = useState("");
  const [taggedWith, setTaggedWith] = useState("");
  const [moneySpent, setMoneySpent] = useState<[number, number]>([0, 0]);
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

  useEffect(() => {
    //first filter by query
    let filteredProjectsList = items.filter(
      (project) =>
        project.title.toLowerCase().includes(queryValue.toLowerCase()) ||
        project.description.toLowerCase().includes(queryValue.toLowerCase()),
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
      if (key === "moneySpent") setMoneySpent(value as [number, number]);
      if (key === "projectStatus") setProjectStatus(value as string[]);
    };

  const handleFilterRemove = (key: string) => {
    if (key === "taggedWith") {
      setTaggedWith(emptyFilterState.taggedWith.value);
    } else if (key === "moneySpent") {
      setMoneySpent(emptyFilterState.moneySpent.value);
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
            { label: "Open", value: "Open" },
            { label: "In Progress", value: "In Progress" },
            { label: "Done", value: "Done" },
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
          autoComplete="off"
          labelHidden
        />
      ),
      shortcut: true,
      pinned: true,
    },
    {
      key: "moneySpent",
      label: "Money spent",
      value: moneySpent,
      filter: (
        <RangeSlider
          label="Money spent is between"
          labelHidden
          value={moneySpent}
          prefix="$"
          output
          min={0}
          max={2000}
          step={1}
          onChange={handleFilterChange("moneySpent")}
        />
      ),
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

  return (
    <div style={{ height: "568px" }}>
      <Card roundedAbove="sm" padding="0">
        <ResourceList
          resourceName={{ singular: "project", plural: "projects" }}
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
    </div>
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

  function renderItem(item: {
    id: string;
    title: string;
    description: string;
    status: string;
  }) {
    const { id, description, title } = item;
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

    return (
      <ResourceList.Item
        id={id}
        url={id}
        media={media}
        accessibilityLabel={`View details for ${title}`}
      >
        <Text as="h3" fontWeight="bold">
          {highlightText(title)}
        </Text>
        <div>{highlightText(description)}</div>
      </ResourceList.Item>
    );
  }

  function highlightText(text: string) {
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

