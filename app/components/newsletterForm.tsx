import {
  CalloutCard,
  TextField,
  Text,
  BlockStack,
  Card,
} from "@shopify/polaris";
import { useCallback, useEffect, useState } from "react";
import { useFetcher } from "@remix-run/react";

function SuccessMessage({ value }: { value: string }) {
  return (
    <Card>
      <BlockStack>
        <Text as={"p"}>
          Thank you for subscribing to my newsletter. Your email({value}) is
          subscribed and you will receive a confirmation email shortly.
        </Text>
      </BlockStack>
    </Card>
  );
}

export function NewsletterForm() {
  const [showForm, setShowForm] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [value, setValue] = useState("");
  let fetcher = useFetcher({ key: "newsletterForm" });
  const formIsLoading = ["loading", "submitting"].includes(fetcher.state);

  useEffect(() => {
    if (fetcher.data?.status === "success") {
      fetcher.load("/api/reset");
      setShowSuccessMessage(true);
      setShowForm(false);
    }
  }, [fetcher.data]);
  const handleChange = useCallback(
    (newValue: string) => setValue(newValue),
    [],
  );
  function handleFormSubmit() {
    console.log("Form submitted with email:", value);
    fetcher.submit(
      { email: value },
      { action: "/api/create-subscription", method: "POST" },
    );
  }

  if (showSuccessMessage) {
    return <SuccessMessage value={value} />;
  } else if (!showForm) {
    return null;
  }

  return (
    <CalloutCard
      title="Subscribe to my newsletter"
      illustration="https://cdn.shopify.com/s/files/1/0889/0256/6193/files/subscribe_illustration.png?v=1725140280"
      primaryAction={{ content: "Subscribe", onAction: handleFormSubmit }}
      onDismiss={() => setShowForm(false)}
    >
      <BlockStack gap={"200"}>
        <TextField
          loading={formIsLoading}
          label="Email"
          labelHidden={true}
          type="email"
          value={value}
          onChange={handleChange}
          autoComplete="email"
        />
        <Text as={"p"}>
          Subscribe to my newsletter to get updates on new projects and blog
          posts. I write about things relates to Shopify. My content is mostly
          intended for the developers but when possible I try to keep it simple
          enough for Shopify merchants to understand.
        </Text>
      </BlockStack>
    </CalloutCard>
  );
}
