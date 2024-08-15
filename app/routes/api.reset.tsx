import {json, LoaderFunction} from "@remix-run/node";
import {authenticate} from "~/shopify.server";

export const loader: LoaderFunction = async ({request}) => {
  await authenticate.admin(request);
  return json({});
}
