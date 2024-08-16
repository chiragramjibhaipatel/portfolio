import {
  ActionFunctionArgs,
  json,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData
} from "@remix-run/node";
import {authenticate} from "~/shopify.server";
import {getImageUrl} from "~/utils/fileUpload.server";

export const action = async ({request}: ActionFunctionArgs) => {
  const {admin} = await authenticate.admin(request);
  console.log("Inside image upload action");
  const uploadHandler = unstable_createMemoryUploadHandler({
    maxPartSize: 1_000_000,
  });
  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );
  let file = formData.get("file") as File;
  console.log("File", file);
  let {imageUrl} = await getImageUrl({admin, file});
  return json({imageUrl});
}
