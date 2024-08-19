import { useCallback, useEffect, useMemo, useState } from "react";
import { Combobox, Icon, Listbox } from "@shopify/polaris";
import { SearchIcon } from "@shopify/polaris-icons";

export function StoreList({
  allStoreUrls,
  storeUrl,
  handleProjectChange,
}: {
  allStoreUrls: string[];
  storeUrl: string;
  handleProjectChange: (value: string, id: string) => void;
}) {
  const [selectedStoreUrl, setSelectedStoreUrl] = useState<
    string | undefined
  >();
  console.log("Selected store URL: ", selectedStoreUrl);
  const [inputValue, setInputValue] = useState(storeUrl);
  const deselectedStoreUrls = useMemo(
    () => [
      ...allStoreUrls
        .filter((store) => store !== selectedStoreUrl)
        .map((store) => ({ value: store, label: store })),
    ],
    [allStoreUrls],
  );
  const [options, setOptions] = useState(deselectedStoreUrls);

  const escapeSpecialRegExCharacters = useCallback(
    (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    [],
  );
  
  const updateText = useCallback(
    (value: string) => {
      setInputValue(value);

      if (value === "") {
        setOptions(deselectedStoreUrls);
        return;
      }

      const filterRegex = new RegExp(escapeSpecialRegExCharacters(value), "i");
      const resultOptions = deselectedStoreUrls.filter((option) =>
        option.label.match(filterRegex),
      );
      setOptions(resultOptions);
    },
    [deselectedStoreUrls, escapeSpecialRegExCharacters],
  );

  const updateSelection = useCallback(
    (selected: string) => {
      console.log("Selected Store URL", selected);
      const matchedOption = options.find((option) => {
        return option.value.match(selected);
      });

      setSelectedStoreUrl(selected);
      setInputValue((matchedOption && matchedOption.label) || "");
      handleProjectChange(selected, "storeUrl");
    },
    [options],
  );

  const optionsMarkup =
    options.length > 0
      ? options.map((option) => {
          const { label, value } = option;

          return (
            <Listbox.Option
              key={`${value}`}
              value={value}
              selected={selectedStoreUrl === value}
              accessibilityLabel={label}
            >
              {label}
            </Listbox.Option>
          );
        })
      : null;

  useEffect(() => {
    if (allStoreUrls.includes(storeUrl)) {
      setSelectedStoreUrl(storeUrl);
      setInputValue(storeUrl);
    } else {
      setSelectedStoreUrl(undefined);
      setInputValue("");
      handleProjectChange("", "storeUrl");
    }
  }, [allStoreUrls]);

  return (
    <Combobox
      activator={
        <Combobox.TextField
          disabled={allStoreUrls.length === 0}
          prefix={<Icon source={SearchIcon} />}
          onChange={updateText}
          label="Store URL"
          value={inputValue}
          placeholder="Store URL"
          autoComplete="off"
        />
      }
    >
      {options.length > 0 ? (
        <Listbox onSelect={updateSelection}>{optionsMarkup}</Listbox>
      ) : null}
    </Combobox>
  );
}
