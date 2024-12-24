import { useRouter } from "next/router";
import Modal from "@mui/material/Modal";
import FeatureDetail from "components/detailPage/FeatureDetail";
import Skeleton from "@mui/material/Skeleton";
import Grid from "@mui/material/Grid";
import CssBaseline from "@mui/material/CssBaseline";
import { getFeatureDetailForClient } from "services/FeatureDetailAPI";
import { useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react";
import FeatureDetailContext from "context/FeatureDetailContext";

// import typescript Interfaces
import { Client, Feature, FeaturesConfig, Status, TableView } from "types/api.types";

// import custom components
import ModalContent from "components/detailPage/ModalContent";
import ModalHeader from "components/detailPage/ModalHeader";
import ModalSidebar from "components/detailPage/ModalSidebar";
import AppContext from "context/AppContext";
import { ExpandedConfigAction, ExpandedConfigMethod } from "types/context.types";
import useSWR from "swr";
import Home from "../../index";

/**
 * Reduces the current state based on the given action for managing an expanded configuration list.
 *
 * @param {Array<number>} state - The current state of the expanded configuration list.
 * @param {ExpandedConfigAction} action - The action to be applied to the state.
 *
 * @return {Array<number>} The new state of the expanded configuration list after applying the action.
 */
function expandedConfigReducer(state: Array<number>, action: ExpandedConfigAction): Array<number> {
    switch (action.type) {
        case ExpandedConfigMethod.ADD: {
            return [...state, action.payload];
        }
        case ExpandedConfigMethod.REMOVE: {
            return state.filter((item: number) => item !== action.payload);
        }
        default:
            return state;
    }
}

/**
 *
 * @constructor
 */
function FeatureDetailPage() {
    const router = useRouter();
    const { setClientIdInView, clients, featureList, clientsLoading } = useContext(AppContext);
    const clientId = Number(router.query.clientId as string);
    let client: Client | undefined;
    const featureKey = router.query.featurekey as string;
    const [featureId, setFeatureId] = useState<number | undefined>();
    const [featuresDetailConfigSelected, setFeaturesDetailConfigSelected] = useState<
        Array<FeaturesConfig>
    >([]);
    const [activeTab, setActiveTab] = useState({ index: 0, name: TableView.CLIENT });
    const [configExpanded, dispatchConfigExpanded] = useReducer(expandedConfigReducer, []);

    // Fetch data using SWR instead of manual state
    // Rename SWR's `data` to `featuresDetail` for clarity
    const {
        data: featuresDetail,
        error,
        isLoading,
        mutate,
    } = useSWR(featureId && clientId ? [featureId, clientId] : null, () =>
        getFeatureDetailForClient(featureId, clientId),
    );

    useEffect(() => {
        // set, in global context, which client Id has been selected
        setClientIdInView(clientId);
    }, [clientId, setClientIdInView]);

    useEffect(() => {
        if (featureKey && featureList.length > 0) {
            const featId = featureList.find((feature) => feature.key === featureKey)?.id;
            if (featId) {
                setFeatureId(featId);
            }
        }
    }, [router, featureKey, featureList]);

    // Handle update or refresh logic, using SWR's mutate to trigger a re-fetch
    const handleFeatureUpdate = useCallback(async () => {
        await mutate(); // Re-fetch data from the server
    }, [mutate]); // `mutate` is stable across renders

    const featDetailContext = useMemo(
        () => ({
            activeTab,
            setActiveTab,
            configExpanded,
            dispatchConfigExpanded,
            featureId,
            handleFeatureUpdate,
        }),
        [activeTab, featureId, configExpanded, handleFeatureUpdate],
    );

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Etwas ist leider schief gelaufen. Versuchen Sie es noch einmal.</div>;

    const onCloseAction = () => {
        // get filteredFeatures and filteredClients if present in the url
        const { "fltr-clients": fltrClients, "fltr-features": fltrFeatures } = router.query;
        // redirect to home page keeping the query params and the hash
        router.push({
            pathname: "/",
            query: {
                ...(fltrFeatures && { "fltr-features": fltrFeatures }),
                ...(fltrClients && { "fltr-clients": fltrClients }),
            },
            hash: `id-clt-${clientId}`,
        });
    };

    if (!clientsLoading) {
        // check if the client id coming from router is present in the list
        if (clients.some((clnt: Client) => clnt.id === clientId)) {
            [client] = clients.filter((clnt) => clnt.id === clientId);
        } else {
            return <p>Der Mandant wurde nicht gefunden</p>;
        }

        // Error handling in case feature o client are not present
        if (!featureList.some((feat) => feat.key === featureKey)) {
            return <p>Das Feature wurde nicht gefunden</p>;
        }
        if (!client) {
            return <p>Der Mandant wurde nicht gefunden</p>;
        }
    }

    /**
     * Retrieves the status of a feature based on the provided feature key and client.
     *
     * @return {Status} - The status of the selected feature, or undefined if not found.
     */
    function getFeatureStatus(): Status | undefined {
        const selectedFeature: Feature | undefined =
            client && client.features.find((feature: Feature) => feature.key === featureKey);
        return selectedFeature?.status;
    }

    return (
        <FeatureDetailContext.Provider value={featDetailContext}>
            <CssBaseline />
            {
                /* if loading is in progress, show the placeholder elements */
                clientsLoading && <Skeleton variant="rounded" height="100vh" />
            }
            {
                /* if loading is in progress, show the placeholder elements */
                !clientsLoading && (
                    <Home isDetailPage>
                        <Modal
                            open // The modal should always be shown on page load, it is the 'page'
                            onClose={onCloseAction}
                        >
                            <ModalContent container rowSpacing={3}>
                                {/* Header */}
                                <Grid container>
                                    <ModalHeader
                                        featuresDetail={featuresDetail}
                                        client={client}
                                        color="inherit"
                                        onCloseAction={onCloseAction}
                                    />
                                </Grid>

                                {/* Table content */}
                                <Grid item xs={8} sx={{ p: 3, height: "100%" }}>
                                    <FeatureDetail
                                        clientId={clientId}
                                        featureId={featuresDetail?.id}
                                        featureStatus={getFeatureStatus()}
                                        featuresDetailConfig={featuresDetail?.configurations}
                                        featuresDetailConfigSelected={featuresDetailConfigSelected}
                                    />
                                </Grid>

                                {/* Sidebar */}
                                <ModalSidebar
                                    featureKey={featureKey}
                                    featuresDetailConfig={featuresDetail?.configurations}
                                    jsonSchema={featuresDetail?.jsonSchema || {}}
                                    setFeaturesDetailConfigSelected={
                                        setFeaturesDetailConfigSelected
                                    }
                                    item
                                    xs={4}
                                />
                            </ModalContent>
                        </Modal>
                    </Home>
                )
            }
        </FeatureDetailContext.Provider>
    );
}

export default FeatureDetailPage;

/* start-test-block */
export { expandedConfigReducer };
/* end-test-block */
