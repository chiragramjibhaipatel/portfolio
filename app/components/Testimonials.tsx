import { NavLink } from "@remix-run/react";
import {
  Avatar,
  BlockStack,
  Card,
  InlineStack,
  Layout,
  Link,
  Text,
} from "@shopify/polaris";
import { useBlazeSlider } from "react-blaze-slider";

export function Testimonials({ data }: { data: Data[] }) {
  const ref = useBlazeSlider({
    all: {
      slidesToShow: 3,
    },
  });
  return (
    <div className="blaze-slider" ref={ref}>
      <div className="blaze-container">
        <div className="blaze-track-container">
          <div className="blaze-track">
            {data.map((item) => (
              <Testimonial key={item.id} item={item} />
            ))}
          </div>
        </div>
        <>
          {/* navigation buttons */}
          <div className="controls">
            <button className="blaze-prev">prev</button>
            <div className="blaze-pagination"></div>
            <button className="blaze-next">next</button>
          </div>
        </>
      </div>
    </div>
  );
}

function Testimonial({ item }: { item: Data }) {
  const testimonial = item.testimonial.text.substring(0, 300).concat("...");
  return (
      <Card>
        <BlockStack gap={"200"} align="space-evenly">
          <BlockStack gap={"200"}>
            <InlineStack gap={"200"}>
              <Avatar customer size="xl" name={item.client} />
              <BlockStack>
                <Text variant="bodyMd" children={item.client} as={"p"}></Text>
                <Text variant="bodySm" as={"span"}>
                  <div style={{ fontStyle: "italic" }}>{item.company}</div>
                </Text>
              </BlockStack>
            </InlineStack>
            <InlineStack>
              <Layout>
                <Layout.Section>
                  <Text
                    variant="bodySm"
                    children={
                      <div style={{ fontStyle: "italic" }}>{testimonial}</div>
                    }
                    as={"span"}
                  />
                </Layout.Section>
              </Layout>
            </InlineStack>
          </BlockStack>
          <InlineStack>
            <NavLink to={`/portfolio/${item.id}`}>view more</NavLink>
          </InlineStack>
        </BlockStack>
      </Card>
  );
}
