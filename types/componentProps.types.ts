import { DividerProps } from "@mui/material";
import { AppBarProps } from "@mui/material/AppBar";
import { GridProps } from "@mui/material/Grid";
import { RJSFSchema } from "@rjsf/utils";
import { AppProps } from "next/app";
import { Dispatch, MouseEvent, ReactNode, SetStateAction } from "react";
import { NextPage } from "next";
import {
    Client,
    ClientOrFeature,
    FeaturesConfig,
    FeaturesDetail,
    Status,
    StatusValue,
    TableView,
    Usage,
} from "./api.types";

/*
Interfaces for the Components
*/

export interface IDAppProps extends AppProps {
    Component: NextPage<HomeProps>;
}

export type SetFilteredValue = Dispatch<SetStateAction<Array<ClientOrFeature>>>;

export interface HomeProps {
    setFeatureStatus?: (name: FeatSelectedStatus) => void;
    isDetailPage?: boolean;
    children?: ReactNode; // 👈 children prop type
}

export interface SidebarProps {
    setFeatureStatus?: (name: FeatSelectedStatus) => void;
}

export type IDComboSelectProps = {
    values: Array<ClientOrFeature>;
    title: string;
    placeholder: string;
    setFilteredValues: SetFilteredValue;
    filteredValues: Array<ClientOrFeature>;
    showId?: boolean;
};

export interface ClientCardProps {
    client: Client;
}

export interface IDInfoButtonProps {
    align?: string;
}

export interface IDRadioGroupProps {
    setFeatureStatus: (name: FeatSelectedStatus) => void;
}

export interface ModalHeaderProps extends AppBarProps {
    featuresDetail?: FeaturesDetail;
    client?: Client;
    onCloseAction: () => void;
}

export interface ModalSidebarProps extends GridProps {
    featuresDetailConfig?: Array<FeaturesConfig>;
    jsonSchema: RJSFSchema;
    setFeaturesDetailConfigSelected: (arg: Array<FeaturesConfig>) => void;
    featureKey: string;
}

export interface IdToggleProps {
    config?: FeaturesConfig;
    featureKey: string;
    toggleConfig: (event: MouseEvent<HTMLDivElement>, name: string) => void;
    disabled?: boolean;
    selected?: boolean;
    jsonSchema: RJSFSchema | null;
}

export interface IDDividerProps extends DividerProps {
    marginTop?: string;
}

export interface FeatureDetailProps {
    clientId: number;
    featureId: number | undefined;
    featureStatus: Status | undefined;
    featuresDetailConfig: Array<FeaturesConfig> | undefined;
    featuresDetailConfigSelected: Array<FeaturesConfig>;
}

export interface IDDataGridProps {
    usages: Array<Usage>;
    tableView: TableView;
    status?: StatusValue;
    getCategoryName: (usageId: number) => string | undefined;
    getTagName: (usageId: number) => string | undefined;
}

export interface IDTabPanelProps {
    activeTab: number;
    clientId: number;
    usages: Array<Usage>;
    filteredUsages: Array<Usage>;
    tableView: TableView;
    featureStatus?: StatusValue;
    alertMessage?: string;
    index: number;
}

export interface IDModalProps {
    modalOpen: boolean;
    modalWidth?: string;
    handleClose: () => void;
    titleText?: string;
    descriptionText?: string;
    textAlign?: "left" | "center" | "right" | "justify" | "inherit";
    children?: ReactNode;
}

export interface IDFormProps {
    id: number;
    clientId: number;
    name: string;
    jsonSchema: RJSFSchema;
    settings: Record<string, unknown>;
}

export interface FormAddUsageProps {
    configId: number;
    closeModal: () => void;
    setShowSuccessMessage: (showSuccessMessage: boolean) => void;
}

export interface FormAddConfigurationProps {
    jsonSchema: RJSFSchema;
    closeModal: () => void;
}

export enum FeatSelectedStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    ALL = "",
}
