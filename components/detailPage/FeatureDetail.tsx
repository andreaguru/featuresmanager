import * as React from "react";
import { Dispatch, SetStateAction, SyntheticEvent, useContext, useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Tabs, { TabsProps } from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box, { BoxProps } from "@mui/material/Box";
import ClientIcon from "@mui/icons-material/Apartment";
import CategoryIcon from "@mui/icons-material/AccountTree";
import TagIcon from "@mui/icons-material/LocalOffer";
import Badge, { BadgeProps } from "@mui/material/Badge";

// import typescript Interfaces
import { FeatureDetailProps } from "types/componentProps.types";
import { FeaturesConfig, TableView, Usage } from "types/api.types";

// import utils
import { getSelectedUsages, getUsageStatusColor } from "utils/utils";

// import custom components
import { getUsagesPerFeature } from "services/FeatureDetailAPI";
import { useUpdateEffect } from "utils/customHooks";
import FeatureDetailContext from "context/FeatureDetailContext";
import { ActiveTab } from "types/context.types";
import TabPanel from "./TabPanel";

const FeatureDetailContainer = styled(Box)<BoxProps>({
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
});

const IDBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
    "& .MuiBadge-badge": {
        right: theme.spacing(-1),
        top: -2,
    },
}));

const IDTabs = styled(Tabs)<TabsProps>(({ theme }) => ({
    "& .MuiTab-root": {
        justifyContent: "flex-start",
    },
    "& .MuiTab-labelIcon": {
        textTransform: "none",
        minHeight: 0,
        opacity: 1,
        paddingTop: "12px",
        paddingBottom: "12px",
    },
    "& .Mui-selected": {
        bgcolor: "white", // Customize the background color of the selected tab
    },
    ".MuiTab-root": {
        paddingRight: theme.spacing(3),
    },
}));

const TabsContainer = styled(Box)({
    backgroundColor: "white",
    flex: "1 1 100%",
    height: "90%",
});

/**
 * setStateIsConfigSelected
 * @param {Array<FeaturesConfig>} featuresDetailConfigSelected
 * @param {Dispatch<SetStateAction<boolean>>} setIsConfigSelected
 */
function setStateIsConfigSelected(
    featuresDetailConfigSelected: Array<FeaturesConfig>,
    setIsConfigSelected: Dispatch<SetStateAction<boolean>>,
) {
    setIsConfigSelected(featuresDetailConfigSelected.length > 0);
}

/**
 *
 * @param {FeatureDetailProps} {featureStatus, featuresDetailConfig, featuresDetailConfigSelected}
 * @constructor
 */
function FeatureDetail({
    clientId,
    featureId,
    featureStatus,
    featuresDetailConfig,
    featuresDetailConfigSelected,
}: FeatureDetailProps) {
    const [usages, setUsages] = useState<Array<Usage>>([]);
    const [clientUsages, setClientUsages] = useState<Array<Usage>>([]);
    const [categoryUsages, setCategoryUsages] = useState<Array<Usage>>([]);
    const [tagUsages, setTagUsages] = useState<Array<Usage>>([]);
    const [isConfigSelected, setIsConfigSelected] = useState<boolean>(false);
    const { activeTab, setActiveTab } = useContext(FeatureDetailContext);
    useEffect(() => {
        // if a configuration has been selected, show it only, otherwise show all configs
        const configToShow = featuresDetailConfigSelected.length
            ? featuresDetailConfigSelected
            : featuresDetailConfig;
        if (featureId) {
            const usagesPromise = getUsagesPerFeature(clientId, featureId, configToShow);

            usagesPromise.then((data: Array<Usage>) => {
                if (data && Object.keys(data).length) {
                    setUsages(data);

                    /* if a configuration has been selected, show the relative Badge component with the number of usages
                    that are displayed, otherwise show only the text label */
                    setStateIsConfigSelected(featuresDetailConfigSelected, setIsConfigSelected);
                } else {
                    setUsages([]);
                }
            });
        }
    }, [featuresDetailConfig, featuresDetailConfigSelected, clientId, featureId]);

    useUpdateEffect(() => {
        setClientUsages(usages.filter((u) => u.id.clientId > 0));
        setCategoryUsages(usages.filter((u) => u.id.categoryId > 0));
        setTagUsages(usages.filter((u) => u.id.tagId > 0));
    }, [usages]);

    const handleChange = (event: SyntheticEvent, newActiveTab: number) => {
        const tableViewList = Object.values(TableView);
        setActiveTab((prevActiveTab: ActiveTab) => ({
            ...prevActiveTab,
            index: newActiveTab,
            name: tableViewList[newActiveTab],
        }));
    };

    return (
        <FeatureDetailContainer>
            <IDTabs
                value={activeTab.index}
                textColor="inherit"
                indicatorColor="secondary"
                onChange={handleChange}
                aria-label="basic tabs example"
            >
                <Tab
                    id="simple-tab-index-0"
                    aria-controls="simple-tabpanel-0"
                    icon={<ClientIcon color={getUsageStatusColor(clientUsages)} />}
                    iconPosition="start"
                    label={
                        isConfigSelected ? (
                            <IDBadge
                                badgeContent={getSelectedUsages(usages, TableView.CLIENT).length}
                                color="primary"
                            >
                                Mandant
                            </IDBadge>
                        ) : (
                            "Mandant"
                        )
                    }
                />
                <Tab
                    id="simple-tab-index-1"
                    aria-controls="simple-tabpanel-1"
                    icon={<CategoryIcon color={getUsageStatusColor(categoryUsages)} />}
                    iconPosition="start"
                    label={
                        isConfigSelected ? (
                            <IDBadge
                                badgeContent={getSelectedUsages(usages, TableView.CATEGORY).length}
                                color="primary"
                            >
                                Kategorie
                            </IDBadge>
                        ) : (
                            "Kategorie"
                        )
                    }
                />
                <Tab
                    id="simple-tab-index-2"
                    aria-controls="simple-tabpanel-2"
                    icon={<TagIcon color={getUsageStatusColor(tagUsages)} />}
                    iconPosition="start"
                    label={
                        isConfigSelected ? (
                            <IDBadge
                                badgeContent={getSelectedUsages(usages, TableView.TAG).length}
                                color="primary"
                            >
                                Tag
                            </IDBadge>
                        ) : (
                            "Tag"
                        )
                    }
                />
            </IDTabs>
            <TabsContainer
                sx={{
                    backgroundColor: "white",
                    flex: "1 1 100%",
                    height: "90%",
                }}
            >
                <TabPanel
                    activeTab={activeTab.index}
                    clientId={clientId}
                    usages={usages}
                    filteredUsages={clientUsages}
                    tableView={TableView.CLIENT}
                    featureStatus={featureStatus && featureStatus.client}
                    index={0}
                />
                <TabPanel
                    activeTab={activeTab.index}
                    clientId={clientId}
                    usages={usages}
                    filteredUsages={categoryUsages}
                    tableView={TableView.CATEGORY}
                    featureStatus={featureStatus?.category}
                    alertMessage="Nicht konfigurierte Kategorien erhalten automatisch
                    die Konfiguration des Mandanten/Tags"
                    index={1}
                />
                <TabPanel
                    activeTab={activeTab.index}
                    clientId={clientId}
                    usages={usages}
                    filteredUsages={tagUsages}
                    tableView={TableView.TAG}
                    featureStatus={featureStatus?.tag}
                    alertMessage="Nicht konfigurierte Tags erhalten automatisch
                    die Konfiguration des Mandanten/der Kategorie"
                    index={2}
                />
            </TabsContainer>
        </FeatureDetailContainer>
    );
}

export default FeatureDetail;

/* start-test-block */
export { getSelectedUsages, setStateIsConfigSelected };
/* end-test-block */
