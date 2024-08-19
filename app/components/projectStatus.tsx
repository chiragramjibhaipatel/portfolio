import {Select} from "@shopify/polaris";

export function ProjectStatus ({status, handleProjectChange}: {
    handleProjectChange: (value: string | string[], id: string) => void;
    status: any;
}) {
    
    const options = [
        {label: 'Open', value: 'OPEN'},
        {label: 'In Progress', value: 'IN_PROGRESS'},
        {label: 'Done', value: 'DONE'},
    ];
    
    return (
        <Select
            label="Project Status"
            options={options}
            onChange={(value) => handleProjectChange(value, 'status')}
            value={status}
        />
    );
}
