import { useContext, useState } from "react";
import { DataGrid, gridClasses, GridColDef, GridRowId } from "@mui/x-data-grid";
import { styled, useTheme } from "@mui/material/styles";
import { alpha } from "@mui/material";

// MUI/Custom MUI Icons
import CircleIcon from "@mui/icons-material/Circle";
import IDHelpIcon from "components/shared/IDHelpIcon";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

// MUI/Custom MUI Components
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Fade from "@mui/material/Fade";
import Image from "next/legacy/image";

import ConfigurationNotFound from "assets/conf_not_found.min.svg";

// import typescript Interfaces
import { IDDataGridProps } from "types/componentProps.types";
import {
    TableView,
    TargetId,
    Usage,
    UsageId,
    UsageTarget,
    UsageToModifyOrDelete,
} from "types/api.types";

// import API Services
import { deleteUsagesPerFeature, editUpdateUsageStatus } from "services/FeatureDetailAPI";

// import global Context
import { dateTimeFormatter } from "utils/utils";
import IDModalButton from "components/shared/IDModalButton";
import ModalButtonsContainer from "components/shared/ModalButtonsContainer";
import FeatureDetailContext from "context/FeatureDetailContext";
import IDModalDialog from "../shared/IDModalDialog";

const noRowsOverlay = () => (
    <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100%"
        padding={2}
    >
        <Image
            alt=""
            layout="fixed"
            src={ConfigurationNotFound}
            width={225}
            height={54}
            objectFit="contain"
        />
        <Typography variant="body2" color="text.secondary" marginTop={3}>
            Für diesen Bereich gibt es noch keine Einträge. Legen Sie eine Konfiguration an, um
            loszustarten.
        </Typography>
    </Box>
);

const IDDataGridWrapper = styled(DataGrid)(({ theme }) => ({
    "&.MuiDataGrid-root": {
        display: "inline-flex",
        width: "100%",
        maxHeight: `calc(100% - ${theme.spacing(13)})`,
        minHeight: theme.spacing(30),
        maxWidth: "100%",
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(2),
        color: "secondary.main",
    },
    ".MuiDataGrid-virtualScrollerRenderZone": {
        width: "100%",
    },
    ".MuiDataGrid-cell": {
        border: "none",
        alignItems: "start",
        paddingTop: `${theme.spacing(2)}`,
    },
    "&.noUsage": {
        color: theme.palette.secondary.light,
    },
    [`& .${gridClasses.columnSeparator}`]: {
        visibility: "visible",
    },
    ".modifiedField": {
        [`& .${gridClasses.columnSeparator}`]: {
            display: "none",
        },
    },
    ".MuiDataGrid-columnHeaderDraggableContainer": {
        display: "block",
    },
    [`& .${gridClasses.row}`]: {
        overflow: "hidden",
        transition: "min-height 0.3s, max-height 0.3s",
        "&.odd": {
            backgroundColor: theme.palette.grey[100],
        },
        ".deleteAndEdit": {
            paddingTop: theme.spacing(1),
            visibility: "hidden",
        },
        "&:hover": {
            backgroundColor: alpha(theme.palette.primary.main, 0.08),
            ".deleteAndEdit": {
                visibility: "visible",
            },
        },
        "& .MuiDataGrid-cell:focus": {
            outline: "none",
        },
        "& .MuiDataGrid-cell:focus-within": {
            outline: "none",
        },
        "&.editMode": {
            border: `solid 2px ${theme.palette.primary.main}`,
            width: "100%",
            backgroundColor: "white",
            "&:hover": {
                backgroundColor: "white",
                ".deleteAndEdit .deleteUsage ": {
                    visibility: "hidden",
                },
            },
        },
    },
    ".MuiFormControlLabel-root": {
        marginTop: "-10px",
        ".MuiFormControlLabel-label": {
            fontSize: theme.typography.caption.fontSize,
        },
        "&.active .MuiFormControlLabel-label": {
            color: theme.palette.success.main,
        },
        "&.inactive .MuiFormControlLabel-label": {
            color: theme.palette.error.main,
        },
    },
}));

const IDSwitch = styled(Switch)(({ theme }) => ({
    "& .MuiSwitch-switchBase.Mui-checked": {
        color: theme.palette.success.main,
        "&:hover": {
            backgroundColor: `${theme.palette.success.main}20`,
        },
        "& + .MuiSwitch-track": {
            backgroundColor: theme.palette.success.main,
        },
    },
    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
        backgroundColor: theme.palette.success.main,
    },
    "& .MuiSwitch-switchBase": {
        color: theme.palette.error.main,
        "&:hover": {
            backgroundColor: `${theme.palette.error.main}20`,
        },
    },
    "& .MuiSwitch-switchBase + .MuiSwitch-track": {
        backgroundColor: theme.palette.error.main,
    },
}));

/**
 * UsagesTable Component
 * @constructor
 */
function UsagesTable({ usages, tableView, status, getCategoryName, getTagName }: IDDataGridProps) {
    const theme = useTheme();
    const { handleFeatureUpdate } = useContext(FeatureDetailContext);

    /* currentEditRow is the row that is currently being edited.
    When a row is being edited, it is not possible to delete it. */
    const [currentEditRow, setCurrentEditRow] = useState<GridRowId | undefined>();

    const [selectedUsage, setSelectedUsage] = useState<UsageToModifyOrDelete | undefined>();
    const [openWindow, setOpenWindow] = useState(false);
    const [usageState, setUsageState] = useState<boolean | undefined>();

    /* isUnsavedChange tells us that there is currently an unsaved change in the row. */
    const [isUnsavedChange, setIsUnsavedChange] = useState<boolean>(false);
    const [saveMode, setSaveMode] = useState<boolean>(false);

    const handleClose = () => {
        setSaveMode(false);
        if (!isUnsavedChange) {
            setCurrentEditRow(undefined);
            setUsageState(undefined);
        }
        setOpenWindow(false);
    };

    const handleEditMode = (rowId: GridRowId, isActive: boolean) => {
        if (isUnsavedChange) {
            setOpenWindow(true);
        } else if (!isUnsavedChange && currentEditRow === rowId) {
            handleClose();
        } else {
            setCurrentEditRow(rowId);
            setUsageState(isActive);
        }
    };

    const getDescriptionText = (rowId: GridRowId) => {
        if (currentEditRow === rowId) {
            return usageState ? "aktivieren" : "deaktivieren";
        }
        return "löschen";
    };

    /**
     * Retrieves the usage target ID based on the provided parameters.
     */
    const getUsageTarget = (
        id: UsageId,
        category: string | undefined,
        tag: string | undefined,
        rowId: GridRowId,
    ): UsageTarget => {
        switch (tableView) {
            case TableView.CLIENT:
                return {
                    targetId: TargetId.CLIENT,
                    id: id.clientId,
                    descriptionText: `Willst du die Konfiguration auf dem gesamten Mandanten
wirklich <strong>${getDescriptionText(rowId)}</strong>?`,
                };
            case TableView.CATEGORY:
                return {
                    targetId: TargetId.CATEGORY,
                    id: id.categoryId,
                    descriptionText: `Willst du die Konfiguration auf der <strong>Kategorie ${category}</strong>
wirklich <strong>${getDescriptionText(rowId)}</strong>?`,
                };
            case TableView.TAG:
                return {
                    targetId: TargetId.TAG,
                    id: id.tagId,
                    descriptionText: `Willst du die Konfiguration auf dem <strong>Tag ${tag}</strong>
wirklich <strong>${getDescriptionText(rowId)}</strong>?`,
                };
            default:
                return {
                    targetId: TargetId.CLIENT,
                    id: id.clientId,
                    descriptionText: `Willst du die Konfiguration auf dem gesamten Mandanten
wirklich <strong>${getDescriptionText(rowId)}</strong>?`,
                };
        }
    };

    const handleOpen = (
        usage: Usage,
        category: string | undefined,
        tag: string | undefined,
        rowId: GridRowId,
        rowStatus?: boolean,
    ) => {
        setSaveMode(true);
        const usageTarget = getUsageTarget(usage.id, category, tag, rowId);
        const newUsage: Usage = { ...usage };
        if (rowStatus !== undefined) {
            newUsage.active = rowStatus;
        }
        setSelectedUsage({ ...usageTarget, usage: newUsage });
        setOpenWindow(true);
    };

    const deleteUsage = (usageToDelete: UsageToModifyOrDelete | undefined) => {
        if (usageToDelete) {
            const { targetId, id, usage } = usageToDelete;
            // We get the row to delete using ID combination, same as we do for getRowId in IDDataGridWrapper
            deleteUsagesPerFeature(targetId, id, usage.id.configurationId).then(() =>
                handleFeatureUpdate(),
            );
        }
    };

    const updateUsage = (usageToModify: UsageToModifyOrDelete | undefined) => {
        if (usageToModify) {
            editUpdateUsageStatus(usageToModify).then(() => {
                handleFeatureUpdate();
                setCurrentEditRow(undefined);
                setUsageState(undefined);
                setIsUnsavedChange(false);
            });
        }
    };

    const hasUnsavedChanges = () => !saveMode && isUnsavedChange;

    const saveAndClose = () => {
        if (currentEditRow) {
            updateUsage(selectedUsage);
        } else {
            deleteUsage(selectedUsage);
        }
        handleClose();
    };

    const columns: GridColDef[] = [
        {
            field: "active",
            headerName: "Status",
            headerClassName: `${status === "NONE" ? "disabled" : ""}`,
            headerAlign: "center",
            sortable: status !== "NONE",
            align: "center",
            width: 80,
            renderCell: (params) => (
                <div>
                    {params.id === currentEditRow ? (
                        <FormControlLabel
                            value={params.value}
                            className={usageState ? "active" : "inactive"}
                            control={
                                <Fade in>
                                    <IDSwitch
                                        onChange={() => {
                                            setUsageState((prevState) => !prevState);
                                            setIsUnsavedChange(!usageState !== params.value);
                                        }}
                                        checked={usageState}
                                    />
                                </Fade>
                            }
                            label={usageState ? "aktiviert" : "deaktiviert"}
                            labelPlacement="bottom"
                        />
                    ) : (
                        <CircleIcon color={params.value ? "id_green" : "id_red"} fontSize="small" />
                    )}
                </div>
            ),
        },
        {
            field: "category",
            headerName: "Kategorie",
            sortable: status !== "NONE",
            flex: 0.6,
            valueGetter: (params) => getCategoryName(params.row?.id?.categoryId),
        },
        {
            field: "categoryId",
            headerName: "Kategorie Id",
            headerAlign: "right",
            sortable: status !== "NONE",
            align: "right",
            width: 120,
            renderCell: (params) => (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "end",
                    }}
                >
                    {params.row?.id?.categoryId}
                    <Button
                        variant="outlined"
                        size="small"
                        sx={{ mt: theme.spacing(2.2) }}
                        onClick={() => handleEditMode(params.rowNode.id, params.row?.active)}
                    >
                        Abbrechen
                    </Button>
                </div>
            ),
        },
        {
            field: "tag",
            headerName: "Tag",
            sortable: status !== "NONE",
            flex: 0.6,
            valueGetter: (params) => getTagName(params.row?.id?.tagId),
        },
        {
            field: "tagId",
            headerName: "Tag Id",
            headerAlign: "right",
            sortable: status !== "NONE",
            align: "right",
            width: 130,
            renderCell: (params) => (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "end",
                    }}
                >
                    {params.row?.id?.tagId}
                    <Button
                        variant="outlined"
                        size="small"
                        sx={{ mt: theme.spacing(2.2) }}
                        onClick={() => handleEditMode(params.rowNode.id, params.row?.active)}
                    >
                        Abbrechen
                    </Button>
                </div>
            ),
        },
        {
            field: "configurationName",
            headerName: "Konfiguration",
            sortable: status !== "NONE",
            width: 180,
            renderCell: (params) => (
                <div style={{ display: "flex", flexDirection: "column" }}>
                    {params.value}
                    <Button
                        variant="contained"
                        disabled={usageState === params.row?.active}
                        size="small"
                        sx={{ mt: theme.spacing(2.2), alignSelf: "flex-start" }}
                        onClick={() =>
                            handleOpen(
                                params.row,
                                getCategoryName(params.row?.id?.categoryId),
                                getTagName(params.row?.id?.tagId),
                                params.rowNode.id,
                                !params.row?.active,
                            )
                        }
                    >
                        Speichern
                    </Button>
                </div>
            ),
            renderHeader: (params) => (
                <div style={{ fontWeight: "500" }}>
                    {params.colDef.headerName}
                    <Tooltip
                        title="Alle Einstellungen eines Features können rechts unter Konfigurationen in Instanzen
                    angelegt/geändert werden. Diese Instanzen können links auf den Ebenen Mandant,
                    Kategorie oder Tag angewendet und aktiviert werden."
                        placement="right"
                    >
                        <IDHelpIcon />
                    </Tooltip>
                </div>
            ),
        },
        {
            field: "modified",
            headerName: "Zuletzt geändert",
            headerClassName: "modifiedField",
            sortable: status !== "NONE",
            width: 160,
            flex: 1,
            valueFormatter: (params) => dateTimeFormatter(params.value, "de-DE"),
        },
        {
            field: "deleteAndEdit",
            headerName: "",
            cellClassName: "deleteAndEdit",
            sortable: status !== "NONE",
            width: 160,
            flex: 1,
            align: "right",
            renderCell: (params) => (
                <div style={{ fontWeight: "500" }}>
                    {params.colDef.headerName}
                    <IconButton
                        onClick={() =>
                            handleOpen(
                                params.row,
                                getCategoryName(params.row?.id?.categoryId),
                                getTagName(params.row?.id?.tagId),
                                params.rowNode.id,
                            )
                        }
                        className="deleteUsage"
                    >
                        <DeleteIcon color="primary" />
                    </IconButton>
                    <IconButton
                        onClick={() => handleEditMode(params.rowNode.id, params.row?.active)}
                    >
                        <EditIcon color="primary" />
                    </IconButton>
                </div>
            ),
        },
    ];

    const columnVisibilityModel = {
        category: tableView === TableView.CATEGORY,
        categoryId: tableView === TableView.CATEGORY,
        tag: tableView === TableView.TAG,
        tagId: tableView === TableView.TAG,
    };

    return (
        <>
            <IDModalDialog
                modalOpen={openWindow}
                modalWidth={`${theme.spacing(50)}px`}
                handleClose={handleClose}
                descriptionText={
                    hasUnsavedChanges()
                        ? "Du arbeitest gerade an etwas... Bitte beende das, bevor du etwas anderes machst."
                        : selectedUsage?.descriptionText
                }
            >
                {/* code for the buttons is passed directly as children, as there is a lot of customization */}
                <ModalButtonsContainer>
                    {!hasUnsavedChanges() ? (
                        <>
                            <IDModalButton color="secondary" onClick={handleClose}>
                                Abbrechen
                            </IDModalButton>
                            <IDModalButton color="primary" onClick={() => saveAndClose()}>
                                {currentEditRow ? "Speichern" : "Löschen"}
                            </IDModalButton>
                        </>
                    ) : (
                        // in case of error, we show only one button which has no other action apart from handleClose.
                        <IDModalButton onClick={handleClose}>Okay</IDModalButton>
                    )}
                </ModalButtonsContainer>
            </IDModalDialog>
            <IDDataGridWrapper
                rows={usages}
                getRowId={(row) =>
                    `${row.id.configurationId}-${row.id.clientId}-${row.id.categoryId}-${row.id.tagId}`
                }
                className={!usages.length ? "noUsage" : ""}
                columns={columns}
                columnVisibilityModel={columnVisibilityModel}
                hideFooter
                getRowClassName={(params) => {
                    const rowClasses = [
                        currentEditRow === params.id ? "editMode" : "",
                        params.indexRelativeToCurrentPage % 2 !== 0 ? "odd" : "",
                    ].filter(Boolean);
                    return rowClasses.join(" ");
                }}
                getRowHeight={(params) => (params.id === currentEditRow ? 115 : null)}
                slots={{
                    noRowsOverlay,
                }}
                sx={{
                    // if usage is deactivated, column title color is set to light gray
                    "& .MuiDataGrid-columnHeader": {
                        color: status === "NONE" ? "secondary.light" : "",
                    },
                }}
            />
        </>
    );
}

export default UsagesTable;
