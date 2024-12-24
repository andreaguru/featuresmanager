import useSWR, { useSWRConfig } from "swr";
import { Client, Feature } from "types/api.types";
import { fetcher } from "utils/utils";
import logger from "../logger";
import BlackListClients from "./BlackListClients";

// import Typescript Interfaces

// get the endpoints from the environment variables
const cmsEndpoint = process.env.NEXT_PUBLIC_CMS_API_CLIENTS as string;
const featureListEndpoint = process.env.NEXT_PUBLIC_SETTINGS_API_FEATURES as string;
const settingsApiEndpoint = process.env.NEXT_PUBLIC_SETTINGS_API_OVERVIEW_BASE as string;

/**
 * Get the complete list of the clients.
 * @return {Promise<Array<Client>>}
 * @constructor
 */
export function useClientList(): Array<Client> {
    const { data, error, isLoading } = useSWR(cmsEndpoint, fetcher);
    // return two arrays with the data from the two fetch requests

    if (isLoading) {
        return [];
    }

    if (error) {
        logger.error("Could not get Clients", error);
        return [];
    }

    // filter the result in order to show only clients that have a name and that are not in the black list
    const clientArray: Array<Client> = data.filter(
        (client: Client) => client.name && !BlackListClients.includes(client.id),
    );
    clientArray.sort((clientPrev, clientNext) => clientPrev.name.localeCompare(clientNext.name));
    return clientArray;
}

/**
 * Get Feature List for a specific client.
 * @constructor
 */
export function useFeaturesPerClient(
    clientId: number,
    clientIdInView: number | undefined,
): Array<Feature> {
    const { cache } = useSWRConfig();
    const isCached = cache.get(`${settingsApiEndpoint}/${clientId}`);
    const { data, error, isLoading } = useSWR(`${settingsApiEndpoint}/${clientId}`, fetcher, {
        /* We re-fetch the features in case there are not data cached
        in case of navigation from detail page back to home,
        we also re-fetch them but only for the client that has been selected.
        For the other client, the features are taken from SWR cache. */
        revalidateOnFocus: false,
        revalidateOnMount: isCached === undefined || clientIdInView === clientId,
    });
    if (error) {
        logger.error("Could not get Features for client {}", clientId, error);
        return [];
    }
    if (isLoading) {
        return [];
    }
    return data;
}

/**
 * Get complete Feature List.
 * @return {Array<Client>}
 * @constructor
 */
export function useFeaturesListPromise(): Array<Feature> {
    const { data, error, isLoading } = useSWR(featureListEndpoint, fetcher);
    // return two arrays with the data from the two fetch requests

    if (isLoading) {
        return [];
    }

    if (error) {
        logger.error("Could not get Features list", error);
        return [];
    }
    return data;
}
