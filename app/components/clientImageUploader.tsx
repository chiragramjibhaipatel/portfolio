import { useFetcher } from "@remix-run/react";
import { useCallback, useEffect, useState } from "react";
import {
  BlockStack,
  Button,
  Card,
  DropZone,
  InlineGrid,
  InlineStack,
  Spinner,
  Text,
} from "@shopify/polaris";

export function ClientImageUploader({
  imageUrl,
  handleSetImageUrl,
}: {
  imageUrl?: string | null;
  handleSetImageUrl: (imageUrl: string) => void;
}) {
  let fetcherFileUpload = useFetcher<{ imageUrl: string }>({
    key: "fileUpload",
  });
  const fetcherFileUploadLoading = ["loading", "submitting"].includes(
    fetcherFileUpload.state,
  );

  const [file, setFile] = useState<File>();
  const [openFileDialog, setOpenFileDialog] = useState(false);

  const toggleOpenFileDialog = useCallback(
    () => setOpenFileDialog((openFileDialog) => !openFileDialog),
    [],
  );

  useEffect(() => {
    if (
      fetcherFileUpload.state === "idle" &&
      fetcherFileUpload.data?.imageUrl
    ) {
      console.log("File uploaded successfully", fetcherFileUpload.data);
      handleSetImageUrl(fetcherFileUpload.data.imageUrl);
      fetcherFileUpload.load("/api/reset");
    }
  }, [fetcherFileUpload]);

  const handleDropZoneDrop = useCallback(
    (_dropFiles: File[], acceptedFiles: File[], _rejectedFiles: File[]) => {
      console.log("Accepted Files: ", acceptedFiles);
      let formData = new FormData();
      formData.append("file", acceptedFiles[0]);
      fetcherFileUpload.submit(formData, {
        action: "/api/image/upload",
        method: "POST",
        encType: "multipart/form-data",
      });
      setFile(acceptedFiles[0]);
    },
    [],
  );

  const validImageTypes = ["image/gif", "image/jpeg", "image/png"];

  const fileUpload = !file && !imageUrl && (
    <DropZone.FileUpload actionTitle={"Upload"} />
  );
  const uploadedFile = fetcherFileUploadLoading ? (
    <InlineStack blockAlign={"center"} align={"center"}>
      <Spinner accessibilityLabel="Image is being uploaded" size="small" />
    </InlineStack>
  ) : (
    <InlineStack>
      <img
        style={{ maxWidth: "100%", borderRadius: "7px" }}
        src={
          file && validImageTypes.includes(file.type)
            ? window.URL.createObjectURL(file)
            : (imageUrl ?? "")
        }
      />
    </InlineStack>
  );

  return (
    <Card>
      <BlockStack gap={"100"}>
        <InlineGrid columns="1fr auto">
          <Text as="h2" variant="bodyMd">
            Logo/Image
          </Text>
          {(file || imageUrl) && (
            <Button onClick={toggleOpenFileDialog} variant={"plain"}>
              Change
            </Button>
          )}
        </InlineGrid>
        <DropZone
          disabled={fetcherFileUploadLoading}
          allowMultiple={false}
          onDrop={handleDropZoneDrop}
          openFileDialog={openFileDialog}
          onFileDialogClose={toggleOpenFileDialog}
        >
          {uploadedFile}
          {fileUpload}
        </DropZone>
      </BlockStack>
    </Card>
  );
}
