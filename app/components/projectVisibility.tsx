import {
  Text,
  InlineStack,
  Box,
  Card,
  Button,
  Badge,
  BlockStack,
  useBreakpoints,
  Bleed,
} from "@shopify/polaris";
import { useState, useCallback } from "react";
export function ProjectVisibility({
  visible,
  handleProjectChange,
}: {
  visible: boolean;
  handleProjectChange: (value: boolean, id: string) => void;
}) {
  const [enabled, setEnabled] = useState(visible);

  const handleToggle = useCallback(() => {
    setEnabled((enabled) => !enabled);
    handleProjectChange(!enabled, "visible");
  }, []);

  const contentStatus = enabled ? "Turn off" : "Turn on";

  const toggleId = "setting-toggle-uuid";
  const descriptionId = "setting-toggle-description-uuid";

  const { mdDown } = useBreakpoints();

  const badgeStatus = enabled ? "success" : undefined;

  const badgeContent = enabled ? "On" : "Off";

  const title = "Visibility";
  const description =
    "Control the visibility of this project on your portfolio. When turned off, this project will not be visible to the public.";

  const settingStatusMarkup = (
    <Badge
      tone={badgeStatus}
      toneAndProgressLabelOverride={`Setting is ${badgeContent}`}
    >
      {badgeContent}
    </Badge>
  );

  const settingTitle = title ? (
    <InlineStack gap="200" wrap={false}>
      <InlineStack gap="200" align="start" blockAlign="baseline">
        <label htmlFor={toggleId}>
          <Text variant="headingMd" as="h6">
            {title}
          </Text>
        </label>
        <InlineStack gap="200" align="center" blockAlign="center">
          {settingStatusMarkup}
        </InlineStack>
      </InlineStack>
    </InlineStack>
  ) : null;

  const actionMarkup = (
    <Button
      role="switch"
      id={toggleId}
      ariaChecked={enabled ? "true" : "false"}
      onClick={handleToggle}
      size="slim"
    >
      {contentStatus}
    </Button>
  );

  const headerMarkup = (
    <Box width="100%">
      <InlineStack
        gap="1200"
        align="space-between"
        blockAlign="start"
        wrap={false}
      >
        {settingTitle}
        {!mdDown ? (
          <Box minWidth="fit-content">
            <InlineStack align="end">{actionMarkup}</InlineStack>
          </Box>
        ) : null}
      </InlineStack>
    </Box>
  );

  const descriptionMarkup = (
    <BlockStack gap="400">
      <Text id={descriptionId} variant="bodyMd" as="p" tone="subdued">
        {description}
      </Text>
      {mdDown ? (
        <Box width="100%">
          <InlineStack align="start">{actionMarkup}</InlineStack>
        </Box>
      ) : null}
    </BlockStack>
  );

  return (
    <Bleed>
      <Box borderBlockStartWidth={"025"} borderColor={"border-hover"}>
        <BlockStack gap={{ xs: "400", sm: "500" }}>
          <Box width="100%" paddingBlockStart={"400"}>
            <BlockStack gap={{ xs: "200", sm: "400" }}>
              {headerMarkup}
              {descriptionMarkup}
            </BlockStack>
          </Box>
        </BlockStack>
      </Box>
    </Bleed>
  );
}
