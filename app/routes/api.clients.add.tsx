import {json, LoaderFunctionArgs} from "@remix-run/node";
import {authenticate} from "~/shopify.server";
import db from "~/db.server";

export const loader = async ({request}: LoaderFunctionArgs) => {
  console.log("Inside clients add loader");
  const {session} = await authenticate.admin(request);
  await db.client.createMany({
    data: [
      {
        name: "John Doe 11",
        company: "Doe Inc.",
        about: "John Doe is",
        sessionId: session.id
      },
      {
        name: "Jane Doe 2",
        company: "Doe Inc.",
        about: "Jane Doe is,",
        sessionId: session.id
      },
      {
        name: "John Doe 3",
        company: "Doe Inc.",
        about: "John Doe is",
        sessionId: session.id
      },
      {
        name: "Jane Doe 4",
        company: "Doe Inc.",
        about: "Jane Doe is",
        sessionId: session.id
      }
    ]
  })
  return json({status: "success"});
}
