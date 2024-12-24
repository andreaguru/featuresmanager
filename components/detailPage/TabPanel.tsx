import { getSelectedUsages, showUsageLabel } from "utils/utils";
import { useCallback } from "react";
import { styled, useTheme } from "@mui/material/styles";

// import custom components
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import { useCategoryList, useTagList } from "services/FeatureDetailAPI";

// import typescript Interfaces
import { IDTabPanelProps } from "types/componentProps.types";
import { Alert } from "@mui/material";
import { CategoryMap, CmsTag } from "types/api.types";
import UsagesTable from "./UsagesTable";

const TabPanelContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(2),
}));

/**
 * TabPanel
 *
 * @param {Object} IDTabPanelProps - Props object containing:
 *   @param {number} activeTab - Index of the active tab
 *   @param {number} clientId - ID of the client
 *   @param {Array} usages - List of usages data
 *   @param {Array} filteredUsages - List of filtered usages data
 *   @param {string} tableView - Type of table view
 *   @param {string} featureStatus - Status of the features
 *   @param {string} alertMessage - Message to display as an alert
 *   @param {number} index - Index of the tab panel
 *
 * @return {JSX.Element} - Rendered JSX for the TabPanel component
 */
function TabPanel({
    activeTab,
    clientId,
    usages,
    filteredUsages,
    tableView,
    featureStatus,
    alertMessage,
    index,
}: IDTabPanelProps) {
    const theme = useTheme();

    /**
     * Sets the category list in the state by fetching the data from the server.
     *
     * @return {void}
     */
    const categList: CategoryMap[] = useCategoryList(clientId);

    /**
     * Retrieve tag list for current client ID and update state with the result.
     *
     * @return {void}
     */
    const tagList: CmsTag[] = useTagList(clientId);

    /**
     * getCategoryName
     * @param {number} usageId
     * @return {string}
     */
    const getCategoryName = useCallback(
        (usageId: number) => {
            const usageObj = categList.find((usage) => usage.id === usageId);
            return usageObj?.name;
        },
        [categList],
    );

    /**
     * getTagName
     * @param {number} usageId
     * @return {string}
     */
    const getTagName = useCallback(
        (usageId: number) => {
            const usageObj = tagList.find((usage) => usage.id === usageId);
            return usageObj?.name;
        },
        [tagList],
    );

    return (
        activeTab === index && (
            <div
                role="tabpanel"
                hidden={activeTab !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                style={{ padding: theme.spacing(3), height: "100%" }}
            >
                <TabPanelContainer>{showUsageLabel(filteredUsages)}</TabPanelContainer>
                <UsagesTable
                    usages={getSelectedUsages(usages, tableView)}
                    tableView={tableView}
                    status={featureStatus}
                    getCategoryName={getCategoryName}
                    getTagName={getTagName}
                />
                {alertMessage && (
                    <Alert severity="info">
                        <Typography variant="caption">{alertMessage}</Typography>
                    </Alert>
                )}
            </div>
        )
    );
}

export default TabPanel;
