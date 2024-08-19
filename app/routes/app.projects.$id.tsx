import { authenticate } from "~/shopify.server";
import {
  ActionFunctionArgs,
  json,
  LoaderFunction,
  redirect,
} from "@remix-run/node";
import db from "~/db.server";
import { z } from "zod";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { useIsNew } from "~/hooks/useIsNew";
import { Card, FormLayout, Layout, Page, TextField } from "@shopify/polaris";
import { useEffect, useState } from "react";
import { ClientSelect } from "~/components/clientSelect";
import { StoreList } from "~/components/storeList";
import { ProjectTags } from "~/components/projectTags";
import { ProjectStatus } from "~/components/projectStatus";
import {TitleBar} from "@shopify/app-bridge-react";

//create prop types for the client
type Client = {
  id: string;
  name: string;
  stores: string[];
};



//create project schema for validation
const descriptionMinLength = 5;
const ProjectSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" }),
  description: z.string().min(descriptionMinLength, {
    message: `Description must be at least ${descriptionMinLength} characters long`,
  }),
  tags: z.array(z.string()).optional(),
  clientId: z.string(),
  storeUrl: z.string(),
  status: z.enum(["OPEN", "IN_PROGRESS", "DONE"]),
});

// Define the type for form errors
type FormErrors = {
  formErrors?: string[];
  fieldErrors?: Record<string, string[]>;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const { session } = await authenticate.admin(request);
  const allClients = await db.client.findMany({
    where: {
      sessionId: session.id,
    },
    select: {
      id: true,
      name: true,
      stores: true,
    },
  });
  const { id } = params;
  if (id === "add") {
    return json({ project: null, allClients });
  }

  // get the project from the database
  const project = await db.project.findUnique({
    where: {
      id: id,
      sessionId: session.id,
    },
    select: {
      title: true,
      description: true,
      tags: true,
      clientId: true,
      storeUrl: true,
      status: true,
    },
  });

  return json({ project, allClients });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const { id } = params;
  const formData = await request.json();
  const result = ProjectSchema.safeParse(formData);

  if (!result.success) {
    return json(
      { status: "error", errors: result.error.flatten() },
      { status: 400 },
    );
  }

  const { title, description, tags, clientId, storeUrl, status } = result.data;
  let project;
  if (id === "add") {
    project = await db.project.create({
      data: {
        title,
        description,
        tags,
        sessionId: session.id,
        clientId,
        storeUrl,
        status
      },
    });
    return redirect(`/app/projects/${project.id}`);
  }

  await db.project.update({
    where: {
      id,
      sessionId: session.id,
    },
    data: {
      title,
      description,
      tags,
      clientId,
      storeUrl,
      status
    },
  });

  return json({ success: true });
};

export default function AddProject() {
  let loaderData = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const formIsLoading = ["loading", "submitting"].includes(fetcher.state);
  const isNew = useIsNew(fetcher);
  const [projectData, setProjectData] = useState(loaderData.project);
  const [formErrors, setFormErrors] = useState<FormErrors | undefined>(
    undefined,
  );
  const [selectedClient, setSelectedClient] = useState<
    { id: string; name: string; stores: string[] } | undefined
  >(
    loaderData.allClients.find((client: Client) => client.id === projectData?.clientId),
  );

  useEffect(() => {
    setProjectData(loaderData.project);
    console.log("Project Data Changed", loaderData.project);
  }, [loaderData.project]);

  function handleSubmit(): void {
    const result = ProjectSchema.safeParse(projectData);
    if (!result.success) {
      console.log("Errors: ", result.error.flatten());
      setFormErrors(result.error.flatten());
      return;
    }
    setFormErrors(undefined);

    fetcher.submit(projectData, {
      method: "post",
      encType: "application/json",
    });
  }

  const handleProjectChange = (value: string | string[], id: string) => {
    console.log("value: ", value, "id: ", id);
    if (id === "clientId") {
      const client = loaderData.allClients.find(
        (client : Client) => client.id === value,
      );
      setSelectedClient(client);
    }
    // @ts-ignore
    setProjectData((prev) => {
      return {
        ...prev,
        [id]: value,
      };
    });
  };

  return (
    <Page
      title={isNew ? "Add New Project" : "Edit Project"}
      backAction={{ content: "All Projects", url: "/app" }}
      primaryAction={{
        content: "Save",
        disabled:
          JSON.stringify(loaderData.project) === JSON.stringify(projectData),
        loading: formIsLoading,
        onAction: handleSubmit,
      }}
    >
      <TitleBar title="Your Personal Portfolio" />
      <Layout>
        <Layout.Section>
          <Card>
            <FormLayout>
              <TextField
                label="Title"
                name="title"
                id="title"
                value={projectData?.title}
                error={formErrors?.fieldErrors?.title?.[0]}
                autoComplete={"off"}
                onChange={handleProjectChange}
              />
              <TextField
                label="Description"
                name="description"
                id="description"
                value={projectData?.description}
                error={formErrors?.fieldErrors?.description?.[0]}
                multiline={4}
                autoComplete={"off"}
                onChange={handleProjectChange}
              />
              <FormLayout.Group condensed>
                <ClientSelect
                  handleProjectChange={handleProjectChange}
                  clientId={projectData?.clientId}
                  allClients={loaderData.allClients}
                  error={formErrors?.fieldErrors?.clientId?.[0] || ""}
                />

                <StoreList
                  allStoreUrls={selectedClient?.stores || []}
                  storeUrl={projectData?.storeUrl}
                  handleProjectChange={handleProjectChange}
                />
              </FormLayout.Group>
              <ProjectTags
                tags={projectData?.tags || []}
                handleProjectChange={handleProjectChange}
              />
            </FormLayout>
          </Card>
        </Layout.Section>
        <Layout.Section variant={"oneThird"}>
          <Card>
            <FormLayout>
              <ProjectStatus
                status={projectData?.status}
                handleProjectChange={handleProjectChange}
              />
            </FormLayout>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
