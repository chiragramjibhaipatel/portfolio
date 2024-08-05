import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);

  if (url.searchParams.get("shop")) {
    console.log("Shop is preasent: ", url.searchParams.get("shop"));
    console.log("Redirecting to /app");
    throw redirect(`/app?${url.searchParams.toString()}`);
  }
  console.log("Shop is not present");
  console.log("Redirecting to /portfolio");

  return redirect("/portfolio");
};

export default function App() {}
