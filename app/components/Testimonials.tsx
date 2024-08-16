import { Link } from "@remix-run/react";
import {
  Avatar,
  BlockStack,
  Card,
  InlineStack,
  Layout,
  Text,
} from "@shopify/polaris";
import { useBlazeSlider } from "react-blaze-slider";
import blazeSliderCustomStylesUrl from "../assets/blaze-slider-custom.css?url"


export const links = [{ rel: "stylesheet", href: blazeSliderCustomStylesUrl }];

export function Testimonials({ data }: { data: Data[] }) {
  const ref = useBlazeSlider({
    all: {
      loop: true,
      slidesToShow: 3,
    },
    "(max-width: 900px)": {
      loop: true,
      slidesToShow: 2,
    },
    "(max-width: 500px)": {
      loop: true,
      slidesToShow: 1,
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
            <Avatar customer size="xl" name={item.client?.name} />
            <BlockStack>
              <Text variant="bodyMd" children={item.client?.name} as={"p"}></Text>
              <Text variant="bodySm" as={"span"}>
                <div style={{ fontStyle: "italic" }}>{item.client?.company}</div>
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
          <Link
            prefetch="intent"
            to={`/portfolio/${item.id}`}
            style={{ fontStyle: "italic", textDecorationLine: "none" }}
          >
            <div>view more...</div>
          </Link>
        </InlineStack>
      </BlockStack>
    </Card>
  );
}
