import { Box } from "@shopify/polaris";

export function StarRatings({ rating }: { rating: number }) {
  return (
    <Box
      padding={"025"}
      paddingInlineStart={"200"}
      paddingInlineEnd={"200"}
      background="bg-fill-success"
      borderRadius="300"
      maxWidth="100%"
    >
      <div>
        {[1, 2, 3, 4, 5].map((star) => {
          return (
            <span
              style={{
                display: "inline-block",
                cursor: "pointer",
                color:
                  rating >= star
                    ? "var(--p-color-bg-fill-magic-secondary-active)"
                    : "gray",
                fontSize: `15px`,
              }}
            >
              {" "}
              ★{" "}
            </span>
          );
        })}
      </div>
    </Box>
  );
}
