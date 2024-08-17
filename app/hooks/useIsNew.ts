import { useEffect, useState } from "react";
import {FetcherWithComponents} from "@remix-run/react";

export function useIsNew(fetcher:  FetcherWithComponents<unknown>) {
  const [isNew, setIsNew] = useState(true);
  useEffect(() => {
    if (window.location.pathname.endsWith("/add")) {
      setIsNew(true);
    } else {
      setIsNew(false);
    }
  }, [fetcher]);
  return isNew;
}
