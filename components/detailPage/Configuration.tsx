import { useContext, useState } from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ArrowForwardIos from "@mui/icons-material/ArrowForwardIos";
import { Alert, Divider } from "@mui/material";
import Box from "@mui/material/Box";

// import typescript Interfaces
import { IdToggleProps } from "types/componentProps.types";
import { dateTimeFormatter } from "utils/utils";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import AccessTime from "@mui/icons-material/AccessTime";
import IDModalDialog from "components/shared/IDModalDialog";
import FormAddUsage from "components/detailPage/FormAddUsage";
import FeatureDetailContext from "context/FeatureDetailContext";
import { ExpandedConfigMethod } from "types/context.types";
import FormConfiguration from "./FormConfiguration";

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

const ExpandMore = styled(IconButton, {
    shouldForwardProp: (prop) => prop !== "expand",
})<ExpandMoreProps>(({ theme, expand }) => ({
    transform: !expand ? "rotate(90deg)" : "rotate(270deg)",
    transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest,
    }),
}));

const IDToggleWrapper = styled(Card)(({ theme }) => ({
    flexBasis: "100%",
    "&.Mui-disabled": {
        backgroundColor: theme.palette.grey[200],
    },
    ".MuiCardHeader-root": {
        paddingBottom: 0,
    },
    ".MuiBox-root": {
        cursor: "pointer",
        "&.Mui-selected": {
            backgroundColor: theme.palette.primary.light,
            boxShadow: "rgba(0, 0, 0, 0.1) 0px 3px 6px 0px",
        },
    },
    ".MuiList-root": {
        h6: {
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(1),
            "&:first-of-type": {
                marginTop: 0,
            },
        },
    },
    ".MuiListItem-root": {
        display: "block",
        wordWrap: "break-word",
        lineHeight: 1,
    },
    ".MuiCardContent-root": {
        paddingTop: 0,
        position: "relative",
        backgroundColor: "white",
        "&:last-child": {
            paddingBottom: theme.spacing(1),
        },
    },
}));

const IDCardActions = styled(CardActions)(({ theme }) => ({
    paddingLeft: theme.spacing(2),
    color: theme.palette.id_mediumGray.main,
    paddingTop: 0,
    "& > :last-child": {
        marginLeft: "auto",
    },
}));

/**
 * The Custom Accordion component. Based on MUI Card Complex Interaction
 *
 * @constructor
 */
function Configuration({ disabled, selected, config, toggleConfig, jsonSchema }: IdToggleProps) {
    const [openFormWindow, setOpenFormWindow] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const { configExpanded, dispatchConfigExpanded } = useContext(FeatureDetailContext);
    const { id, clientId, name, modified, settings } = config ?? {
        created: "",
        modified: "",
        name: "",
        id: 0,
        clientId: 0,
        settings: {},
    };

    const handleExpandClick = () => {
        if (configExpanded.includes(id)) {
            dispatchConfigExpanded({ type: ExpandedConfigMethod.REMOVE, payload: id });
        } else {
            dispatchConfigExpanded({ type: ExpandedConfigMethod.ADD, payload: id });
        }
    };

    const modifieddDateformat = dateTimeFormatter(modified as string, "de-DE");

    const handleFormClose = () => {
        setOpenFormWindow(false);
    };

    const handleFormOpen = () => {
        setOpenFormWindow(true);
    };

    return (
        <IDToggleWrapper data-testid="toggle" className={`${disabled ? "Mui-disabled" : ""}`}>
            <Box
                className={`${selected ? "Mui-selected" : ""}`}
                onClick={(event) => toggleConfig(event, name)}
            >
                <CardHeader title={name} titleTypographyProps={{ variant: "subtitle2" }} />
                <IDCardActions>
                    <AccessTime fontSize="small" />
                    <Typography variant="caption">{modifieddDateformat}</Typography>
                    <ExpandMore
                        expand={configExpanded.includes(id)}
                        onClick={handleExpandClick}
                        aria-expanded={configExpanded.includes(id)}
                        aria-label="show more"
                        className="toggleButton"
                        data-testid="toggleButton"
                    >
                        <ArrowForwardIos fontSize="small" />
                    </ExpandMore>
                </IDCardActions>
            </Box>
            <Collapse in={configExpanded.includes(id)} timeout="auto" unmountOnExit>
                <CardContent
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "stretch",
                        gap: 3,
                        alignSelf: "stretch",
                    }}
                    data-testid="collapsedContent"
                >
                    <Divider sx={{ width: "100%" }} />
                    {showSuccessMessage && (
                        <Alert
                            severity="success"
                            variant="outlined"
                            onClose={() => {
                                setShowSuccessMessage(false);
                            }}
                        >
                            Sie haben die neue Usage erfolgreich angelegt.
                        </Alert>
                    )}
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        fullWidth
                        onClick={() => handleFormOpen()}
                    >
                        Usage
                    </Button>
                    {/* We use React Json Schema Form to render the form, based on the jsonSchema property */}
                    {jsonSchema && (
                        <FormConfiguration
                            jsonSchema={jsonSchema}
                            id={id}
                            clientId={clientId}
                            name={name}
                            settings={settings}
                        />
                    )}
                </CardContent>
                <IDModalDialog
                    modalOpen={openFormWindow}
                    handleClose={handleFormClose}
                    titleText="Usage für Konfiguration anlegen"
                >
                    <FormAddUsage
                        configId={id}
                        closeModal={handleFormClose}
                        setShowSuccessMessage={setShowSuccessMessage}
                    />
                </IDModalDialog>
            </Collapse>
        </IDToggleWrapper>
    );
}

export default Configuration;
