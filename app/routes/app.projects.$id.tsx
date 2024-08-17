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
import {
  Card,
  FormLayout,
  InlineStack,
  Layout,
  Page,
  TextField,
} from "@shopify/polaris";
import { useEffect, useState } from "react";
import { ClientSelect } from "~/components/clientSelect";

//create project schema for validation
const ProjectSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" }),
  description: z
    .string()
    .min(50, { message: "Description must be at least 50 characters long" }),
  tags: z.array(z.string()).optional(),
  clientId: z.string(),
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

  const { title, description, tags, clientId } = result.data;
  let project;
  if (id === "add") {
    project = await db.project.create({
      data: {
        title,
        description,
        tags,
        sessionId: session.id,
        clientId,
      },
    });
    return redirect(`/app/projects/${project.id}`);
  }

  project = await db.project.update({
    where: {
      id,
      sessionId: session.id,
    },
    data: {
      title,
      description,
      tags,
      clientId,
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

  const handleProjectChange = (value: string, id: string) => {
    console.log("value: ", value, "id: ", id);
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
              <InlineStack>
                {loaderData.allClients && (
                  <ClientSelect
                    handleProjectChange={handleProjectChange}
                    clientId={projectData?.clientId}
                    allClients={loaderData.allClients}
                  />
                )}
                
              </InlineStack>
              <TextField
                label="Tags"
                name="tags"
                id="tags"
                value={projectData?.tags?.join(",")}
                error={formErrors?.fieldErrors?.tags?.[0]}
                autoComplete={"off"}
                onChange={handleProjectChange}
                  />
            </FormLayout>
          </Card>
        </Layout.Section>
        <Layout.Section variant={"oneThird"}></Layout.Section>
      </Layout>
    </Page>
  );
}
