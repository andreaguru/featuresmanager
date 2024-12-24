import { useTheme } from "@mui/material/styles";
import { useContext, useEffect, useRef, useState } from "react";
import { useIsFirstRender } from "utils/customHooks";

// RJSF Schema
import { IChangeEvent } from "@rjsf/core";
import getUiSchema from "utils/RJSFSchema";
import validator from "@rjsf/validator-ajv8";

// MUI/Custom MUI Components
import Button from "@mui/material/Button";
import ArrayFieldTemplate from "components/detailPage/ArrayFieldTemplate";
import { updateConfiguration } from "services/FeatureDetailAPI";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import Grid from "@mui/material/Grid";

// Typescript Interfaces
import { IDFormProps } from "types/componentProps.types";
import { FeaturesConfig } from "types/api.types";
import IDModalButton from "components/shared/IDModalButton";
import IDForm from "components/shared/IDForm";
import ModalButtonsContainer from "components/shared/ModalButtonsContainer";
import FeatureDetailContext from "context/FeatureDetailContext";
import IDModalDialog from "../shared/IDModalDialog";

/**
 * Renders an FormConfiguration component.
 *
 */
function FormConfiguration({ ...props }: IDFormProps) {
    const [editMode, setEditMode] = useState<boolean>(false);
    const [configuration, setConfiguration] = useState<FeaturesConfig>();
    const [isResetForm, setIsResetForm] = useState<boolean>(false);
    const [backToViewMode, setBackToViewMode] = useState<boolean>(false);
    const [openConfirmWindow, setOpenConfirmWindow] = useState(false);
    const { handleFeatureUpdate } = useContext(FeatureDetailContext);
    const [isError, setIsError] = useState<boolean>(false);
    const [buttonConfirmText, setButtonConfirmText] = useState("");
    const [dialogText, setDialogText] = useState("");
    const theme = useTheme();

    const configurationBase: FeaturesConfig = {
        id: props.id,
        name: props.name,
        clientId: props.clientId,
        settings: {},
    };

    // We use exceptionally a useRef in order to keep track of the current form changes,
    // without causing a reload of the whole component. This is particular useful
    // in case of very frequent changes, like for Form -> onChange method (this is our case).
    const formDataRef = useRef();
    const isFirstRender = useIsFirstRender();

    const handleFormChange = (event: IChangeEvent) => {
        // We need this check as due to a known issue with React Json Schema,
        // where onChange is called also on component mount. We want to avoid this scenario.
        if (!isFirstRender) {
            formDataRef.current = event.formData; // Updating the ref does not cause a re-render
        }
    };

    // set the state with the initial form value and use it in formValue prop
    useEffect(() => {
        setConfiguration({ ...configurationBase, settings: props.settings });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // On form submit, show the Modal Window with the confirmation message
    const submitForm = (event: IChangeEvent) => {
        if (event.formData) {
            setConfiguration({
                ...configurationBase,
                settings: event.formData,
            });
            setButtonConfirmText("Veröffentlichen");
            setDialogText("Möchten Sie Ihre Änderungen veröffentlichen?");
            setOpenConfirmWindow(true);
        }
    };

    // On Modal Window close, reset most of the states
    const handleConfirmClose = () => {
        setOpenConfirmWindow(false);
        setIsError(false);
        setIsResetForm(false);
        setBackToViewMode(false);
    };

    const handleReset = (isBackToView?: boolean) => {
        if (formDataRef.current) {
            setConfiguration({
                ...configurationBase,
                settings: formDataRef.current || {},
            });
        }
        setButtonConfirmText(isBackToView ? "Verwerfen" : "Zurücksetzen");
        setDialogText(
            isBackToView
                ? "Sie haben Änderungen am Dokument vorgenommen. Möchten Sie diese wirklich verwerfen?"
                : "Möchten Sie Ihre Änderungen wirklich zurücksetzen?",
        );
        setOpenConfirmWindow(true);
        setIsResetForm(true);
    };

    // If Edit Mode, remove readonly and make Form Fields editable
    const handleEditMode = () => {
        if (editMode) {
            setBackToViewMode(true);
            handleReset(true);
        } else {
            setEditMode((prevState) => !prevState);
        }
    };

    // Reset Form Data
    const resetConfiguration = () => {
        setConfiguration({ ...configurationBase, settings: props.settings });
        setIsResetForm(false);
        if (backToViewMode) {
            setEditMode(false);
        }
    };

    /* If the user confirms, update the data and returns a promise.
    If there is an error, show the Modal with Error Message */
    const editConfiguration = () => {
        updateConfiguration(configuration)
            .then(() => {
                handleFeatureUpdate();
                setEditMode(false);
            })
            .catch(() => {
                setIsError(true);
                setDialogText(
                    "Es gab ein Problem bei der Aktualisierung Ihrer Daten." +
                        "Bitte versuchen Sie es später noch einmal.",
                );
                setOpenConfirmWindow(true);
            });
    };

    const saveAndClose = () => {
        if (isResetForm) {
            resetConfiguration();
        } else {
            editConfiguration();
        }
        handleConfirmClose();
    };

    return (
        <>
            <IconButton
                sx={{
                    position: "absolute",
                    top: `-${theme.spacing(6)}`, // this change is just temporary in order to let the edit icon be visible. We implement the new Layout in scope of core-2111
                    right: theme.spacing(6),
                    zIndex: 1,
                }}
                onClick={() => handleEditMode()}
            >
                <EditIcon data-testid="editConfig" color={editMode ? "id_mediumGray" : "primary"} />
            </IconButton>
            <Grid container>
                <IDForm
                    name={`form-${props.name}`}
                    schema={props.jsonSchema}
                    // we pass a boolean to uiSchema in order to activate/deactivate the edit mode for arrays
                    uiSchema={getUiSchema(editMode)}
                    formData={configuration?.settings}
                    onSubmit={submitForm}
                    onChange={handleFormChange}
                    validator={validator}
                    // we need to use a custom template for arrays as we have many CSS customizations
                    templates={{ ArrayFieldTemplate }}
                    readonly={!editMode}
                >
                    {editMode && (
                        <>
                            <Button
                                data-testid="resetForm"
                                variant="outlined"
                                onClick={() => handleReset()}
                                sx={{ mr: 2 }}
                                type="reset"
                            >
                                Zurücksetzen
                            </Button>
                            <Button variant="contained" type="submit">
                                Speichern
                            </Button>
                        </>
                    )}
                </IDForm>
                <IDModalDialog
                    modalOpen={openConfirmWindow}
                    handleClose={handleConfirmClose}
                    descriptionText={dialogText}
                    modalWidth={`${theme.spacing(50)}px`}
                >
                    <ModalButtonsContainer>
                        {/* code for the buttons is passed directly as children, as there is a lot of customization */}
                        {!isError ? (
                            <>
                                <IDModalButton color="secondary" onClick={handleConfirmClose}>
                                    Weitermachen
                                </IDModalButton>
                                <IDModalButton
                                    color={isResetForm ? "error" : "primary"}
                                    onClick={() => saveAndClose()}
                                >
                                    {buttonConfirmText}
                                </IDModalButton>
                            </>
                        ) : (
                            // in case of error, we show only one button which has no other action apart from handleConfirmClose.
                            <IDModalButton onClick={handleConfirmClose}>Okay</IDModalButton>
                        )}
                    </ModalButtonsContainer>
                </IDModalDialog>
            </Grid>
        </>
    );
}

export default FormConfiguration;
