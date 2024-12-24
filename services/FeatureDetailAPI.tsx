import {
    BaseFeaturesConfig,
    CategoryMap,
    CmsCategory,
    CmsTag,
    FeaturesConfig,
    FeaturesDetail,
    TargetId,
    Usage,
    UsageToModifyOrDelete,
    UsageWithConfigName,
} from "types/api.types";
import useSWR from "swr";
import { fetcher } from "utils/utils";
import logger from "../logger";

// get the endpoints from the environment variables
const featureDetailEndpoint = process.env.NEXT_PUBLIC_SETTINGS_API_FEATURES as string;
const configurationsEndpoint = process.env.NEXT_PUBLIC_SETTINGS_API_CONFIGURATIONS as string;
const featureUsagesEndpoint = process.env.NEXT_PUBLIC_SETTINGS_API_USAGES as string;
const cmsEndpoint = process.env.NEXT_PUBLIC_CMS_API_CLIENTS as string;

/**
 * Get Feature List for a specific client.
 * @return {Promise<Array<Client>>}
 * @param {number} featureId
 * @param {number} clientId
 */
export async function getFeatureDetailForClient(
    featureId: number | undefined,
    clientId: number,
): Promise<FeaturesDetail> {
    try {
        const featureDetailURL = `${featureDetailEndpoint}/${featureId}`;
        const response = await fetch(featureDetailURL);
        const featureDetail: FeaturesDetail = await response.json();

        const configurationsURL = `${configurationsEndpoint}/client/${clientId}/feature/${featureId}`;
        const configResponse = await fetch(configurationsURL);
        const configurationsAPI: Array<FeaturesConfig> = await configResponse.json();

        const usagePromise = await fetch(
            `${featureUsagesEndpoint}/client/${clientId}/feature/${featureId}`,
        );
        const usages: Array<Usage> = await usagePromise.json();

        const configurations = configurationsAPI.map(
            (config: FeaturesConfig): FeaturesConfig => ({
                usages: usages.filter((usage) => usage.id.configurationId === config.id),
                ...config,
            }),
        );

        // update the configuration list in order to show also the configs
        return {
            ...featureDetail,
            configurations,
        };
    } catch (error) {
        logger.error("Could not get Features Details for Feature Id", featureId, error);
        return Promise.reject(error);
    }
}

/**
 * getUsagesPerFeature
 * @param {number} clientId
 * @param {number} featureId
 * @param {Array<FeaturesConfig>} featuresDetailConfigSelected
 * @return {Promise<Array<UsageWithConfigName>>}
 */
export async function getUsagesPerFeature(
    clientId: number,
    featureId: number,
    featuresDetailConfigSelected: Array<FeaturesConfig>,
) {
    try {
        const response = await fetch(
            `${featureUsagesEndpoint}/client/${clientId}/feature/${featureId}`,
        );
        let usages: Array<Usage> = await response.json();
        if (featuresDetailConfigSelected.length) {
            // create an array of configurations Ids.
            const configurationIds: Array<number> = featuresDetailConfigSelected.map(
                (ftrConfig: FeaturesConfig) => ftrConfig.id,
            );

            // filter the usages in order to show only the ones related to the selected configs
            usages = usages.filter((usage: Usage) =>
                configurationIds.includes(usage.id.configurationId),
            );
        }
        return usages.map(
            (usage): UsageWithConfigName => ({
                configurationName: featuresDetailConfigSelected.filter(
                    (data) => data.id === usage.id.configurationId,
                )[0].name,
                ...usage,
            }),
        );
    } catch (error) {
        logger.error(error);
        return [];
    }
}

/**
 * Deletes feature usages based on the given targetId, id, and configId.
 *
 * @param {TargetId} targetId - The targetId used as a query parameter.
 * @param {number} id - The id used as a query parameter.
 * @param {number} configId - The configId used as a query parameter.
 *
 * @return {Promise<void>} - Promise that resolves with no value on success.
 */
export async function deleteUsagesPerFeature(targetId: TargetId, id: number, configId: number) {
    try {
        await fetch(`${featureUsagesEndpoint}?${targetId}=${id}&configuration-id=${configId}`, {
            method: "DELETE",
        });
        return true;
        // let usages: Array<Usage> = await response.json();
    } catch (error) {
        logger.error(error);
        return [];
    }
}

export function collectCategoriesToArray(category: CmsCategory, categoryMap: Array<CategoryMap>) {
    categoryMap.push({
        id: category.id,
        name: category.name,
    });
    if (category.children) {
        category.children.forEach((childCategory: CmsCategory) => {
            collectCategoriesToArray(childCategory, categoryMap);
        });
    }
}

/**
 * Updates the usage status of a selected usage.
 */
export async function editUpdateUsageStatus(
    selectedUsage: UsageToModifyOrDelete | undefined,
): Promise<Response | void> {
    const targetId = selectedUsage?.targetId;
    const id = selectedUsage?.id;
    const usage = selectedUsage?.usage;

    if (targetId && id && usage) {
        switch (targetId) {
            case TargetId.CLIENT:
                usage.id.clientId = id;
                break;
            case TargetId.CATEGORY:
                usage.id.categoryId = id;
                break;
            case TargetId.TAG:
                usage.id.tagId = id;
                break;
            default:
                usage.id.clientId = id;
        }
    }

    try {
        return await fetch(
            `${featureUsagesEndpoint}
?${targetId}=${id}&configuration-id=${usage?.id.configurationId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(usage),
            },
        );
    } catch (error) {
        logger.error(error);
        return Promise.reject(new Error("Error"));
    }
}

/**
 * getCategoryList
 * @param {number} clientId
 * @return {Array<CategoryMap>}
 */
export function useCategoryList(clientId: number): Array<CategoryMap> {
    const { data, error, isLoading } = useSWR(`${cmsEndpoint}/${clientId}/categories`, fetcher);
    if (error) {
        logger.error("Could not get Categories for client {}", clientId, error);
        return [];
    }
    if (isLoading) {
        return [];
    }
    const rootCategory: CmsCategory = data.category;
    const categoryMap: Array<CategoryMap> = [];
    collectCategoriesToArray(rootCategory, categoryMap);
    return categoryMap;
}

/**
 * getTagList
 * @param {number} clientId
 * @return {Array<CategoryMap>}
 */
export function useTagList(clientId: number): Array<CmsTag> {
    const { data, error, isLoading } = useSWR(`${cmsEndpoint}/${clientId}/tags`, fetcher);
    if (error) {
        logger.error("Could not get Tags for client {}", clientId, error);
        return [];
    }
    if (isLoading) {
        return [];
    }
    return data;
}

/**
 * Updates the usage status of a selected usage.
 */
export async function updateConfiguration(configuration: FeaturesConfig | undefined) {
    if (!configuration) {
        throw new Error("Die Konfiguration wurde nicht gefunden");
    }
    return fetch(`${configurationsEndpoint}/${configuration.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(configuration),
    });
}

/**
 * Create usage based on form data.
 *
 * @param {FormData} formData - The form data containing information needed to create the usage.
 * @returns {Promise<Response>} A promise that resolves to a response from the API call to create the usage.
 */
export async function createUsage(formData: FormData): Promise<Response> {
    const level = formData.get("level");
    const levelId = formData.get("levelId");
    const configruationId = formData.get("configurationId");
    const isActive = formData.get("status") === "on";

    const newUsage = {
        id: {
            clientId: level === "client" ? levelId : 0,
            categoryId: level === "category" ? levelId : 0,
            tagId: level === "tag" ? levelId : 0,
            configurationId: configruationId,
        },
        active: isActive,
    };

    return fetch(`${featureUsagesEndpoint}/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newUsage),
    });
}

export async function createConfiguration(formData: Record<string, unknown>): Promise<Response> {
    const { configFixedInfosWrapper, ...settings } = formData;
    const { configName, clientId, featureId } = configFixedInfosWrapper as {
        configName: string;
        clientId: number;
        featureId: number;
    };

    const newConfiguration: BaseFeaturesConfig = {
        name: configName,
        clientId,
        featureId,
        settings,
    };

    return fetch(`${configurationsEndpoint}/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newConfiguration),
    });
}
