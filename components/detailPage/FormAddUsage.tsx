import { ChangeEvent, FormEvent, ReactElement, useContext, useEffect, useState } from "react";
import { Alert, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import { FormAddUsageProps } from "types/componentProps.types";
import { createUsage } from "services/FeatureDetailAPI";
import AppContext from "context/AppContext";
import FeatureDetailContext from "context/FeatureDetailContext";
import { useTheme } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { TableView } from "types/api.types";
import { ActiveTab } from "types/context.types";
import ModalButtonsContainer from "components/shared/ModalButtonsContainer";

function FormAddUsage({
    configId,
    closeModal,
    setShowSuccessMessage,
}: FormAddUsageProps): ReactElement {
    const [level, setLevel] = useState<ActiveTab>({ index: 0, name: TableView.CLIENT });
    const [levelId, setLevelId] = useState<number | "">("");
    const [errorType, setErrorType] = useState<string | undefined>();
    const { activeTab, setActiveTab, handleFeatureUpdate } = useContext(FeatureDetailContext);
    const { clientIdInView } = useContext(AppContext);
    const theme = useTheme();

    useEffect(() => {
        setLevel(activeTab);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const formAction = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        createUsage(formData)
            .then((response) => {
                if (response && response.ok) {
                    handleFeatureUpdate();
                    setActiveTab((prevActiveTab) => ({
                        ...prevActiveTab,
                        ...level,
                    }));
                    closeModal();
                    setShowSuccessMessage(true);
                } else {
                    // Custom message for failed HTTP codes
                    if (response && response.status === 500)
                        throw new Error("Für diesen Mandanten wurde bereits eine Usage angelegt.");
                    // For any other server error
                    throw new Error(
                        "Die Usage wurde nicht hinzugefügt. Versuchen Sie es noch einmal.",
                    );
                }
            })
            .catch((error) => {
                setErrorType(error.message);
            });
    };
    const handleChange = (event: SelectChangeEvent<TableView>) => {
        const tableViewList = Object.values(TableView);
        const levelName = event.target.value as TableView;
        setLevel((prevState) => ({
            ...prevState,
            index: tableViewList.indexOf(levelName),
            name: levelName,
        }));
    };

    const handleLevelIdChange = (event: ChangeEvent<HTMLInputElement>) => {
        setLevelId(event.target.value !== "" ? parseInt(event.target.value, 10) : "");
    };

    return (
        <form
            onSubmit={formAction}
            style={{
                display: "flex",
                flexDirection: "column",
                gap: theme.spacing(3),
            }}
        >
            <TextField
                required
                size="small"
                name="configurationId"
                label="Konfiguration"
                value={configId}
                inputProps={{
                    readOnly: true,
                }}
                className="readOnly"
            />
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Ebene</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    name="level"
                    value={level.name}
                    label="Ebene"
                    onChange={handleChange}
                    size="small"
                    required
                >
                    <MenuItem value={TableView.CLIENT}>Mandant</MenuItem>
                    <MenuItem value={TableView.CATEGORY}>Kategorie</MenuItem>
                    <MenuItem value={TableView.TAG}>Tag</MenuItem>
                </Select>
            </FormControl>
            <TextField
                required
                name="levelId"
                label={`${level?.name}-ID`}
                type="number"
                onChange={handleLevelIdChange}
                size="small"
                value={level?.name === TableView.CLIENT ? clientIdInView : levelId}
                inputProps={{
                    readOnly: level?.name === TableView.CLIENT,
                }}
                className={level?.name === TableView.CLIENT ? "readOnly" : ""}
            />
            <Typography variant="body1">
                Soll diese Usage nach dem Speichern bereits aktiv sein?
            </Typography>
            <Switch defaultChecked size="medium" name="status" />

            {errorType && (
                <Alert
                    severity="error"
                    data-testid="errorMessage"
                    variant="outlined"
                    onClose={() => setErrorType(undefined)}
                >
                    {errorType}
                </Alert>
            )}

            <ModalButtonsContainer>
                <Button color="primary" onClick={closeModal}>
                    Abbrechen
                </Button>
                <Button type="submit" data-testid="submit" variant="contained">
                    Speichern
                </Button>
            </ModalButtonsContainer>
        </form>
    );
}

export default FormAddUsage;
