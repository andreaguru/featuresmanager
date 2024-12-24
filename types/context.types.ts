import { Dispatch, SetStateAction } from "react";
import { SetFilteredValue } from "types/componentProps.types";
import { Client, Feature, TableView } from "./api.types";

export interface GlobalContext {
    clientIdInView?: number;
    setClientIdInView: (clientId: number) => void;
    clients: Client[];
    setClients: (clients: (prevState: Client[]) => Client[]) => void;
    filteredClients: Client[];
    setFilteredClients: SetFilteredValue;
    featureList: Feature[];
    filteredFeatures: Feature[];
    setFilteredFeatures: SetFilteredValue;
    showSelectedFeatures: (
        featuresPerClient: Feature[],
        showUniversalFeatures?: boolean,
    ) => Feature[];
    clientsLoading: boolean;
}

export interface ActiveTab {
    index: number;
    name: TableView;
}

export enum ExpandedConfigMethod {
    ADD = "ADD",
    REMOVE = "REMOVE",
}

// An interface for our actions
export interface ExpandedConfigAction {
    type: ExpandedConfigMethod;
    payload: number;
}

export interface FeatDetailContext {
    activeTab: ActiveTab;
    setActiveTab: Dispatch<SetStateAction<ActiveTab>>;
    featureId?: number;
    configExpanded: Array<number>;
    dispatchConfigExpanded: Dispatch<ExpandedConfigAction>;
    handleFeatureUpdate: () => void;
}
