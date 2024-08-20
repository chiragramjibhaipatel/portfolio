import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Page } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "~/shopify.server";
import { AdminProjectsList } from "~/components/AdminProjectsList";
import db from "../db.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const projects = await db.project.findMany({
    where: { sessionId: session.id },
    orderBy: { xata_createdat: "desc" },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      clientId: true,
      storeUrl: true,
      client: {
        select: {
          name: true,
          company: true,
        },
      },
    },
  });
  return json({ projects });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const { selectedIProjects } = await request.json();
  console.log({ selectedIProjects });

  await db.project.deleteMany({
    where: {
      sessionId: session.id,
      id: {
        in: selectedIProjects,
      },
    },
  });

  return json({ success: true });
};

export default function Index() {
  let { projects } = useLoaderData<typeof loader>();
  return (
    <Page>
      <TitleBar title="Your Personal Portfolio"></TitleBar>
      <AdminProjectsList allProjects={projects} />
    </Page>
  );
}
