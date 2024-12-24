// MUI Components
import { Tooltip, Typography } from "@mui/material";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";

// Custom components
import { MouseEvent, useCallback, useState } from "react";
import IDToggleList from "components/detailPage/IDToggleList";

import IDHelpIcon from "components/shared/IDHelpIcon";
// import typescript Interfaces
import { FeaturesConfig } from "types/api.types";
import { ModalSidebarProps } from "types/componentProps.types";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import IDModalDialog from "components/shared/IDModalDialog";
import FormAddConfiguration from "components/detailPage/FormAddConfiguration";
import Configuration from "./Configuration";

/**
 * IDModalSidebarWrapper styled component. It enhances MUI Grid Component
 *
 * @constructor
 */
const IDModalSidebarWrapper = styled(Grid)(({ theme }) => ({
    maxHeight: "100%",
    display: "flex",
    flexDirection: "column",
    rowGap: theme.spacing(3),
    backgroundColor: "white",
}));

const ModalSidebarTitle = styled(Typography)(({ theme }) => ({
    marginTop: theme.spacing(1),
}));

/**
 * The Custom Modal Sidebar component.
 * @param {ModalSidebarProps} props
 * @constructor
 */
function ModalSidebar(props: ModalSidebarProps) {
    const {
        featuresDetailConfig,
        setFeaturesDetailConfigSelected,
        featureKey,
        jsonSchema,
        item,
        xs,
    } = props;

    const [selectedUsages, setSelectedUsages] = useState<string>("");
    const [openFormWindow, setOpenFormWindow] = useState(false);
    /**
     *
     * @param {MouseEvent<HTMLElement>} event
     * @param {string} name
     */
    const toggleConfig = useCallback(
        (event: MouseEvent<HTMLElement>, name: string) => {
            const selectedEl = event.target as Element;
            // if toggle button is clicked, do nothing
            if (!selectedEl?.closest(".toggleButton")) {
                let featuresDetailConfigSelected: Array<FeaturesConfig>;
                // if the component is already selected, clean all filters
                if (name === selectedUsages) {
                    setSelectedUsages("");
                    featuresDetailConfigSelected = [];
                    // otherwise filter the configurations according to the selected element
                } else {
                    setSelectedUsages(name);
                    featuresDetailConfigSelected = featuresDetailConfig
                        ? featuresDetailConfig.filter((conf: FeaturesConfig) => conf.name === name)
                        : [];
                }
                /* featuresDetailConfigSelected state will be either n empty array or
            an array that contains the selected configuration */
                setFeaturesDetailConfigSelected(featuresDetailConfigSelected);
            }
        },
        [selectedUsages, setFeaturesDetailConfigSelected, featuresDetailConfig],
    );

    /**
     *
     * @param {string} name
     * @return {boolean}
     */
    function isSelectedCard(name: string) {
        return selectedUsages === name;
    }

    function handleFormOpen() {
        setOpenFormWindow(true);
    }

    const handleFormClose = () => {
        setOpenFormWindow(false);
    };

    return (
        <IDModalSidebarWrapper item={item} xs={xs} data-testid="modalSidebar">
            <Container
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    alignSelf: "stretch",
                }}
            >
                <ModalSidebarTitle variant="subtitle1">
                    Konfigurationen
                    <Tooltip
                        title="Alle Einstellungen eines Features werden hier
                    unter Konfigurationen in Instanzen angelegt/geändert. Diese Instanzen können
                    links auf den Ebenen (Mandant, Kategorie, Tag)
                    an der gewünschten Stelle gesetzt und aktiviert werden."
                        placement="top"
                    >
                        <IDHelpIcon />
                    </Tooltip>
                </ModalSidebarTitle>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleFormOpen()}
                >
                    Konfig.
                </Button>
            </Container>
            <IDToggleList>
                {featuresDetailConfig?.map((config) => (
                    <Configuration
                        key={config.id}
                        featureKey={featureKey}
                        config={config}
                        jsonSchema={jsonSchema}
                        // Configuration is marked as deactivated if it has no usages or if it has no active usages
                        disabled={
                            !config.usages?.length || !config.usages.some((usage) => usage.active)
                        }
                        selected={isSelectedCard(config.name)}
                        toggleConfig={toggleConfig}
                    />
                ))}
            </IDToggleList>
            <IDModalDialog
                modalOpen={openFormWindow}
                handleClose={handleFormClose}
                titleText="Konfiguration anlegen"
            >
                <FormAddConfiguration jsonSchema={jsonSchema} closeModal={handleFormClose} />
            </IDModalDialog>
        </IDModalSidebarWrapper>
    );
}

export default ModalSidebar;
