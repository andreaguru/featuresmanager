// import Fonts
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

// import context and theme
import { ThemeProvider } from "@mui/material/styles";
import Head from "next/head";
import { useRouter } from "next/router";
import { ReactElement, useCallback, useEffect, useMemo, useState } from "react";
import { SWRConfig } from "swr";
import AppContext from "context/AppContext";

import { useClientList, useFeaturesListPromise } from "services/DashboardAPI";

// import typescript Interfaces
import { Client, Feature } from "types/api.types";
import { FeatSelectedStatus, IDAppProps, SetFilteredValue } from "types/componentProps.types";

// import utils
import { useUpdateEffect } from "utils/customHooks";
import edidTheme from "../themes/edid";

/**
 * check if features status has been selected in combobox.
 * If so, returns the features array filtered per status. If not, return the features array without any modification.
 * @param {Array<Feature>} featuresPerClient
 * @param {string} featureStatus
 * @return {Array<Feature>}
 */
function showFeaturesPerStatus(
    featuresPerClient: Array<Feature>,
    featureStatus: FeatSelectedStatus,
): Feature[] {
    switch (featureStatus) {
        case FeatSelectedStatus.ACTIVE:
            return featuresPerClient.filter(
                (feat: Feature) =>
                    Object.values(feat.status).includes("ENABLED") ||
                    Object.values(feat.status).includes("ENABLED_AND_DISABLED"),
            );
        case FeatSelectedStatus.INACTIVE:
            return featuresPerClient.filter(
                (feat: Feature) =>
                    /* Object.values(feat) returns an array with feature name and  */
                    Object.values(feat.status).includes("DISABLED") ||
                    Object.values(feat.status).includes("ENABLED_AND_DISABLED") ||
                    Object.values(feat.status)
                        .slice(1)
                        .every((value) => value === "NONE"),
            );
        case FeatSelectedStatus.ALL:
            return featuresPerClient;
        default:
            return featuresPerClient;
    }
}

/**
 *
 * @constructor
 */
function TemplatePage({ Component }: IDAppProps): ReactElement {
    const [clients, setClients] = useState<Array<Client>>([]);
    const [featureList, setFeatureList] = useState<Array<Feature>>([]);
    const [clientIdInView, setClientIdInView] = useState<number>();
    const router = useRouter();

    // we get the two query string properties from URL (filtered clients and filtered features)
    const { "fltr-clients": fltrClients, "fltr-features": fltrFeatures } = router.query;

    // contains the list of clients that have been selected by the user
    const [filteredClients, setFilteredClients] = useState<Array<Client>>([]);

    // contains the list of features that have been selected by the user
    const [filteredFeatures, setFilteredFeatures] = useState<Array<Feature>>([]);

    /* contains the current selected status of the features to show
        (keine Auswahl, aktiviert, deaktiviert / nicht konfiguriert) */
    const [featureStatus, setFeatureStatus] = useState<FeatSelectedStatus>(FeatSelectedStatus.ALL);

    const [clientsLoading, setClientsLoading] = useState(true);
    const [filtersAreLoaded, setFiltersAreLoaded] = useState(false);

    const clientsFetch = useClientList();
    const featuresListFetch = useFeaturesListPromise();

    useEffect(() => {
        if (clientsFetch && clientsFetch.length > 0 && clientsLoading) {
            // update the returned data array adding empty features array
            const clientsWithEmptyFeatures: Client[] = clientsFetch.map<Client>(
                (client: Client) => ({
                    ...client,
                    features: [],
                }),
            );
            // Wait until all the pending promises are resolved, then update the state
            setClients(clientsWithEmptyFeatures);
            setClientsLoading(false);
        }
    }, [clientsFetch]);

    useEffect(() => {
        if (featuresListFetch && featuresListFetch.length > 0) {
            // update the returned data array adding empty features array
            setFeatureList(featuresListFetch);
        }
    }, [featuresListFetch]);

    /**
     * showSelectedFeatures
     * it shows the Features that have been selected by the user
     * (e.g. checks if "traffective" and "aktiviert" have been selected and shows the result)
     * @param {Array<Feature>} featuresPerClient
     * @param {boolean} showUniversalFeatures
     * @return {Array<Feature>}
     */
    const showSelectedFeatures = useCallback(
        (featuresPerClient: Array<Feature>, showUniversalFeatures?: boolean): Feature[] => {
            const universalFeatures = ["header", "footer"];
            let featuresFilteredPerStatus = showFeaturesPerStatus(featuresPerClient, featureStatus);

            // first of all, we check if the feature list belongs to Allgemein (universal) or Features
            if (showUniversalFeatures) {
                featuresFilteredPerStatus = featuresFilteredPerStatus.filter((feat) =>
                    universalFeatures.includes(feat.key),
                );
            } else {
                featuresFilteredPerStatus = featuresFilteredPerStatus.filter(
                    (feat) => !universalFeatures.includes(feat.key),
                );
            }

            // if one or more features have been selected in the combobox...
            if (filteredFeatures.length > 0) {
                return (
                    /* we return the features that pass the following criteria:
                                1) they have been filtered through showFeaturesPerStatus
                                in order to show them according to the selected status (active, inactive or all)
                                2) are also present in filteredFeatures array. */
                    featuresFilteredPerStatus.filter((feat: Feature) =>
                        // for each feature we check if it is present in filteredFeatures array
                        filteredFeatures.some((filteredFeat) => filteredFeat.id === feat.id),
                    )
                );
                // if there is no feature in filteredFeatures, we show them according to point 1)
            }
            return featuresFilteredPerStatus;
        },
        [featureStatus, filteredFeatures],
    );

    useUpdateEffect(() => {
        // if filtered clients are present in the url, set the filteredClients state
        if (fltrClients?.length) {
            const filtClients = clients.filter((client) => fltrClients.includes(String(client.id)));
            setFilteredClients(filtClients);
        }

        // if filtered features are present in the url, set the filteredFeatures state
        if (fltrFeatures?.length && featuresListFetch.length > 0) {
            const filteredFeature = featuresListFetch.filter((feature) =>
                fltrFeatures.includes(feature.name),
            );
            setFilteredFeatures(filteredFeature);
        }
    }, [clientsLoading]);

    /* The code inside this custom Hook useUpdateEffect is called everytime there is a change in filteredClients state
        but not the first time the component is rendered, like it happens for a normal useEffect
        Docu: https://usehooks-ts.com/react-hook/use-update-effect */
    useUpdateEffect(() => {
        // we create an array with all Ids of selected clients
        const filteredClientIds = filteredClients.map<number>((client) => client.id);
        // we create an array with all names of selected features
        const filteredFeatureNames = filteredFeatures.map<string>((feature) => feature.name);

        /* we update the url, according to the app state, if one of these conditions is true:
                1. filtersAreLoaded is true. This means that either filteredClients or filteredFeatures
                have been called at least once
                2. the url contains no parameters (router.query is empty). This means that
                we are not in the case of a shared url with filters already present in the query parameters.
                 */
        if (filtersAreLoaded || Object.keys(router.query).length === 0) {
            router.push({
                query: {
                    ...(filteredClientIds.length && {
                        "fltr-clients": filteredClientIds,
                    }),
                    ...(filteredFeatureNames.length && {
                        "fltr-features": filteredFeatureNames,
                    }),
                },
            });
        }

        setFiltersAreLoaded(true);
    }, [filteredClients, filteredFeatures]);

    const appContext = useMemo(
        () => ({
            clientIdInView,
            setClientIdInView,
            clients,
            setClients,
            filteredClients,
            setFilteredClients: setFilteredClients as SetFilteredValue,
            featureList,
            filteredFeatures,
            setFilteredFeatures: setFilteredFeatures as SetFilteredValue,
            showSelectedFeatures,
            clientsLoading,
        }),
        [
            clientIdInView,
            setClientIdInView,
            clients,
            setClients,
            filteredClients,
            setFilteredClients,
            featureList,
            filteredFeatures,
            setFilteredFeatures,
            showSelectedFeatures,
            clientsLoading,
        ],
    );

    return (
        <AppContext.Provider value={appContext}>
            {/* We wrap the app into SWR Config in order to have everywhere access to SWR cache informations */}
            <SWRConfig value={{ provider: () => new Map() }}>
                <ThemeProvider theme={edidTheme}>
                    <Head>
                        <link rel="icon" href="/favicon.ico" />
                    </Head>
                    <Component setFeatureStatus={setFeatureStatus} />
                </ThemeProvider>
            </SWRConfig>
        </AppContext.Provider>
    );
}

export default TemplatePage;

/* start-test-block */
export { showFeaturesPerStatus };
/* end-test-block */
