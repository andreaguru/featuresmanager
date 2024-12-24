import FormControl from "@mui/material/FormControl";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import { SyntheticEvent } from "react";

// import typescript Interfaces
import { ClientOrFeature } from "types/api.types";
import { IDComboSelectProps } from "types/componentProps.types";
import { styled, useTheme } from "@mui/material/styles";

const ComboSelectLabel = styled(Typography)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    ...theme.typography.subtitle2,
    color: theme.palette.secondary.main,
}));

/**
 * The Custom ComboSelect component. Based on MUI Autocomplete, it accepts 5 properties:
 * values: the list of options that have to be shown
 * title: the label of the combo box
 * placeholder: the title at the top of the Component
 * setFilteredValues: the setter Method used to update the values
 * showId: used to show extra infos (in brackets) after each option
 *
 * @constructor
 */
function IDComboSelect({
    values,
    title,
    placeholder,
    filteredValues,
    setFilteredValues,
    showId,
}: IDComboSelectProps) {
    const handleChange = (event: SyntheticEvent, value: Array<ClientOrFeature>) => {
        setFilteredValues(value);
    };
    const theme = useTheme();

    return (
        <FormControl>
            {values.length === 0 && <Skeleton variant="rounded" height={56} />}
            {values.length > 0 && (
                <>
                    <Typography component="label" htmlFor={title}>
                        {title}
                    </Typography>
                    <Autocomplete
                        id={title}
                        multiple
                        options={values}
                        value={filteredValues}
                        onChange={handleChange}
                        data-testid="combobox"
                        disableCloseOnSelect
                        noOptionsText="Kein Ergebnis"
                        isOptionEqualToValue={(option: ClientOrFeature, value: ClientOrFeature) =>
                            option.name === value.name
                        }
                        getOptionLabel={(option: ClientOrFeature) =>
                            "key" in option ? option.name : `${option.name} | ${option.id}`
                        }
                        ListboxProps={{
                            style: { maxHeight: "calc(100vh - 320px)" },
                        }}
                        renderOption={(props, option: ClientOrFeature, { selected }) => {
                            const { key, ...rest } = props;
                            return (
                                // eslint-disable-next-line react/jsx-props-no-spreading
                                <li key={key} {...rest} style={{ paddingLeft: theme.spacing(0.5) }}>
                                    <Checkbox
                                        id={`id-${option.id}`}
                                        data-testid={option.id}
                                        checked={selected}
                                        size="small"
                                    />
                                    <ComboSelectLabel>
                                        <Typography
                                            variant="subtitle2"
                                            component="span"
                                            color="secondary.main"
                                            fontWeight="700"
                                        >
                                            {option.name}
                                        </Typography>
                                        {!("key" in option) && (
                                            <Typography
                                                variant="inherit"
                                                component="span"
                                                fontWeight="normal"
                                                color="secondary.light"
                                            >
                                                {showId ? ` | ${option.id}` : ""}
                                            </Typography>
                                        )}
                                    </ComboSelectLabel>
                                </li>
                            );
                        }}
                        renderInput={(params) => (
                            // eslint-disable-next-line react/jsx-props-no-spreading
                            <TextField {...params} placeholder={placeholder} variant="standard" />
                        )}
                    />
                </>
            )}
        </FormControl>
    );
}

export default IDComboSelect;
