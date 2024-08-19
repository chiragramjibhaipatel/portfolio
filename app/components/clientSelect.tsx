import {useCallback, useEffect, useMemo, useState} from "react";
import {Autocomplete, Icon} from "@shopify/polaris";
import {SearchIcon} from "@shopify/polaris-icons";

export function ClientSelect ({
    handleProjectChange,
    allClients,
    clientId,
    error,
}: {
    handleProjectChange: (value: string, id: string) => void;
    clientId: string;
    allClients: { id: string; name: string }[];
    error: string;
}) {
    const deselectedClients = useMemo (
	() => [
	    ...allClients.map ((client) => ({value: client.id, label: client.name})),
	],
	[allClients],
    );
    const [selectedClients, setSelectedClients] = useState<string[]> ([]);
    const [inputValue, setInputValue] = useState ("");
    const [clientsDropdown, setClientsDropdown] = useState (deselectedClients);
    
    const updateText = useCallback (
	(value: string) => {
	    setInputValue (value);
	    
	    if (value === "") {
		setClientsDropdown (deselectedClients);
		return;
	    }
	    
	    const filterRegex = new RegExp (value, "i");
	    const resultOptions = deselectedClients.filter ((option) =>
		option.label.match (filterRegex),
	    );
	    setClientsDropdown (resultOptions);
	},
	[deselectedClients],
    );
    
    const updateClientSelection = useCallback (
	(selected: string[]) => {
	    const selectedValue = selected.map ((selectedItem) => {
		const matchedOption = clientsDropdown.find ((option) => {
		    return option.value.match (selectedItem);
		});
		return matchedOption && matchedOption.label;
	    });
	    
	    setSelectedClients (selected);
	    setInputValue (selectedValue[0] || "");
	    handleProjectChange (selected[0], "clientId");
	},
	[clientsDropdown],
    );
    
    const textField = (
	<Autocomplete.TextField
	    onChange={updateText}
	    label="Client"
	    value={inputValue}
	    prefix={<Icon source={SearchIcon} tone="base"/>}
	    placeholder="Type to search"
	    autoComplete="off"
	    error={error}
	/>
    );
    
    useEffect (() => {
	if (clientId) {
	    const selectedClient = allClients.find (
		(client) => client.id === clientId,
	    );
	    if (selectedClient) {
		setSelectedClients ([selectedClient.id]);
		setInputValue (selectedClient.name);
	    }
	}
    }, [clientId, allClients]);
    
    return (
	    <Autocomplete
		options={clientsDropdown}
		selected={selectedClients}
		onSelect={updateClientSelection}
		textField={textField}
		
	    />
    );
}
