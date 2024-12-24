// Define the custom field wrapper to group the custom fields
import { FieldProps } from "@rjsf/utils";
import Box from "@mui/material/Box";

function ConfigFixedInfosWrapper({ properties }: { properties: Array<FieldProps> }) {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                marginBottom: 3,
            }}
        >
            {properties.map((element: FieldProps) => (
                <div className="property-wrapper" key={element.name}>
                    {element.content}
                </div>
            ))}
        </Box>
    );
}

export default ConfigFixedInfosWrapper;
