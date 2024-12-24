import * as React from "react";
import { MouseEvent, useState } from "react";
import Popover from "@mui/material/Popover";
import Button, { ButtonProps } from "@mui/material/Button";
import Box from "@mui/material/Box";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Paper from "@mui/material/Paper";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import FeedbackIcon from "@mui/icons-material/Feedback";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Link from "@mui/material/Link";
import { styled, useTheme } from "@mui/material/styles";

// import typescript Interfaces
import { IDInfoButtonProps } from "types/componentProps.types";
import Image from "next/legacy/image";

// import custom Components
import iconColors from "assets/icon_colors_icons.svg";
import colorsDiagram from "assets/farben.png";
import drawDiagram from "assets/ausspielung.png";
import drawExampleDiagram from "assets/ausspielung_beispiel.png";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { alpha, Typography } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import IDIconClose from "components/shared/IDIconClose";
import IDAlert from "./IDAlert";

const IDInfoBoxButton = styled(Button)<ButtonProps>(({ theme }) => ({
    marginTop: theme.spacing(3),
    fontSize: theme.typography.pxToRem(14),
    "&:hover": {
        backgroundColor: alpha(theme.palette.primary.main, 0.08),
    },
}));

enum ShowView {
    MENU = "MENU",
    COLORS = "COLORS",
    DRAW = "DRAW",
}

/**
 * Info Footer
 * @constructor
 */
function IDInfoBoxFooter({
    children,
    view,
    id,
    handleChangeView,
}: {
    children: string;
    view: ShowView;
    id: string | undefined;
    handleChangeView: (view: ShowView) => void;
}) {
    return (
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <IDInfoBoxButton
                aria-describedby={id}
                variant="text"
                onClick={() => handleChangeView(view)}
                endIcon={<ArrowForwardIcon />}
            >
                {children}
            </IDInfoBoxButton>
        </Box>
    );
}

/**
 * IDInfoButton component. It accepts 1 parameter:
 * align: alignment of the button
 *
 * @constructor
 */
function IDInfoButton({ align }: IDInfoButtonProps) {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [view, setView] = useState<ShowView>(ShowView.MENU);
    const theme = useTheme();

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        setView(ShowView.MENU);
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleChangeView = (infoView: ShowView) => {
        setView(infoView);
    };

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: align,
            }}
        >
            <Button
                sx={{
                    position: "absolute",
                    top: theme.spacing(3),
                }}
                aria-describedby={id}
                variant="text"
                startIcon={<HelpOutlineIcon />}
                onClick={handleClick}
            >
                Hilfe
            </Button>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                // Other necessary props for Popover component
                sx={{
                    "& .MuiPaper-content": {
                        maxHeight: `calc(100vh - ${theme.spacing(24)})`,
                        overflowY: "auto",
                    },
                    "& strong": {
                        fontWeight: "medium",
                    },
                }}
            >
                {view === ShowView.MENU && (
                    <Paper elevation={0} square sx={{ width: 196, maxWidth: "100%" }}>
                        <MenuList>
                            <MenuItem
                                sx={{ px: theme.spacing(3) }}
                                onClick={() => handleChangeView(ShowView.COLORS)}
                            >
                                <ListItemIcon>
                                    <Image
                                        alt=""
                                        layout="fixed"
                                        src={iconColors}
                                        width={20}
                                        height={20}
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    primaryTypographyProps={{
                                        fontSize: theme.typography.pxToRem(14),
                                    }}
                                >
                                    Farben und Icons
                                </ListItemText>
                            </MenuItem>
                            <MenuItem
                                sx={{ px: theme.spacing(3) }}
                                onClick={() => handleChangeView(ShowView.DRAW)}
                            >
                                <ListItemIcon>
                                    <SyncAltIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primaryTypographyProps={{
                                        fontSize: theme.typography.pxToRem(14),
                                    }}
                                >
                                    Ausspielung
                                </ListItemText>
                            </MenuItem>
                            {/* temporary link to feedback page will be removed/edited for future versions */}
                            <MenuItem
                                sx={{ px: theme.spacing(3) }}
                                component={Link}
                                href="https://test"
                                target="_blank"
                            >
                                <ListItemIcon>
                                    <FeedbackIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primaryTypographyProps={{
                                        fontSize: theme.typography.pxToRem(14),
                                    }}
                                >
                                    Feedback
                                    <OpenInNewIcon
                                        fontSize="inherit"
                                        sx={{ verticalAlign: "3px" }}
                                    />
                                </ListItemText>
                            </MenuItem>
                        </MenuList>
                    </Paper>
                )}

                {/* Header */}
                {view !== ShowView.MENU && (
                    <Paper
                        elevation={0}
                        sx={{
                            position: "sticky",
                            top: 0,
                            zIndex: 1,
                            px: theme.spacing(3),
                        }}
                    >
                        <Button
                            sx={{
                                marginTop: theme.spacing(3),
                                ml: -1,
                                lineHeight: 1,
                            }}
                            aria-describedby={id}
                            variant="text"
                            color="inherit"
                            startIcon={<ArrowBackIcon />}
                            onClick={() => handleChangeView(ShowView.MENU)}
                        >
                            Übersicht
                        </Button>
                        <IDIconClose size="small" color="inherit" onClick={handleClose} />
                        <Typography
                            component="h1"
                            textAlign="center"
                            fontWeight="medium"
                            fontSize={theme.typography.pxToRem(18)}
                            paddingBottom={theme.spacing(2)}
                        >
                            {view === ShowView.COLORS ? "Farben und Icons" : "Ausspielung"}
                        </Typography>
                    </Paper>
                )}

                {/* Content */}
                {view === ShowView.COLORS && (
                    <Paper
                        elevation={0}
                        className="MuiPaper-content"
                        sx={{
                            width: 509,
                            maxWidth: "100%",
                            p: theme.spacing(3),
                            pt: 0,
                        }}
                    >
                        <Typography
                            fontSize={theme.typography.pxToRem(14)}
                            sx={{ marginBottom: theme.spacing(4) }}
                        >
                            <strong>Konfigurationen</strong> können auf
                            <strong>&nbsp;Mandanten, Kategorie</strong> oder
                            <strong>Tag-Ebene</strong> vorgenommen werden.
                        </Typography>

                        <Image alt="Farben und Icons" src={colorsDiagram} />

                        {/* Footer */}
                        <IDInfoBoxFooter
                            view={ShowView.DRAW}
                            id={id}
                            handleChangeView={handleChangeView}
                        >
                            weiter zu Ausspielung
                        </IDInfoBoxFooter>
                    </Paper>
                )}

                {/* Content */}
                {view === ShowView.DRAW && (
                    <Paper
                        elevation={0}
                        className="MuiPaper-content"
                        sx={{
                            width: 509,
                            maxWidth: "100%",
                            p: theme.spacing(3),
                            pt: 0,
                        }}
                    >
                        <Typography
                            fontSize={theme.typography.pxToRem(14)}
                            sx={{ marginBottom: theme.spacing(4) }}
                        >
                            Konfigurationen werden <strong>direkt</strong> auf
                            <strong>&nbsp;Mandant, Kategorie</strong> oder <strong>Tag</strong>{" "}
                            gesetzt. Die <strong>Priorität</strong> der Ausspielung geht
                            <strong>&nbsp;von Tag</strong> über <strong>Kategorie</strong> zu{" "}
                            <strong>Mandant</strong>. Dabei wird mit <strong>Überschreiben</strong>{" "}
                            und <strong>Übernehmen</strong> gearbeitet.
                        </Typography>

                        <Box sx={{ textAlign: "center" }}>
                            <Image alt="Ausspielung" src={drawDiagram} />
                        </Box>

                        <IDAlert
                            icon={<InfoOutlinedIcon sx={{ fontSize: "medium" }} />}
                            severity="info"
                            sx={{ mb: 4, mt: 3 }}
                        >
                            <Typography variant="caption">
                                Mögliche Konfigurationen aus CUE auf dem Artikel überschreiben alles
                            </Typography>
                        </IDAlert>

                        <Typography
                            fontSize={theme.typography.pxToRem(14)}
                            sx={{ marginBottom: theme.spacing(3) }}
                        >
                            In der <strong>Übersicht der Mandanten</strong> sieht man einzig,{" "}
                            <strong>wie</strong>
                            &nbsp;Einstellung allgemein <strong>konfiguriert</strong> ist. Möchte
                            man herausfinden,
                            <strong>welche Konfiguration</strong>
                            &nbsp;auf einem <strong>Artikel</strong> speziell{" "}
                            <strong>ausgespielt</strong> wird, so muss man sich die{" "}
                            <strong>gesetzten Tags</strong>, die jeweilige{" "}
                            <strong>Kategorie</strong> und den <strong>Mandanten</strong> ansehen.
                            <br />
                            <br />
                            <strong>Artikel:</strong> &quot;Manuel Neuer kauft eine neues Haus&quot;
                        </Typography>

                        <Box sx={{ textAlign: "center" }}>
                            <Image alt="Ausspielung Beispiel" src={drawExampleDiagram} />
                        </Box>

                        {/* Footer */}
                        <IDInfoBoxFooter
                            id={id}
                            view={ShowView.COLORS}
                            handleChangeView={handleChangeView}
                        >
                            weiter zu Farben & Icons
                        </IDInfoBoxFooter>
                    </Paper>
                )}
            </Popover>
        </Box>
    );
}

export default IDInfoButton;
