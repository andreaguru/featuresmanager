import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";

// import typescript Interfaces
import { FeatSelectedStatus, IDRadioGroupProps } from "types/componentProps.types";
import { ChangeEvent } from "react";

/**
 *
 * @constructor
 */
function IDRadioGroup({ setFeatureStatus }: IDRadioGroupProps) {
    const handleFeatureStatusChange = (event: ChangeEvent<HTMLInputElement>) => {
        // the input value has to be a string that is included in the FeatSelectedStatus enum
        setFeatureStatus((event.target as HTMLInputElement).value as FeatSelectedStatus);
    };

    return (
        <FormControl>
            <Typography component="label">Status der Features</Typography>
            <RadioGroup
                sx={{ pl: 2 }}
                onChange={handleFeatureStatusChange}
                name="radio-buttons-group"
            >
                <FormControlLabel
                    value=""
                    control={<Radio size="small" />}
                    label={<Typography variant="body2">keine Auswahl</Typography>}
                />
                <FormControlLabel
                    value="ACTIVE"
                    control={<Radio size="small" />}
                    label={<Typography variant="body2">aktiviert</Typography>}
                />
                <FormControlLabel
                    value="INACTIVE"
                    control={<Radio size="small" />}
                    label={
                        <Typography variant="body2">deaktiviert / nicht konfiguriert</Typography>
                    }
                />
            </RadioGroup>
        </FormControl>
    );
}

export default IDRadioGroup;
