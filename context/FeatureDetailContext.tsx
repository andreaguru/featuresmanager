import { createContext } from "react";
import { FeatDetailContext } from "types/context.types";
import { TableView } from "types/api.types";

const FeatureDetailContext = createContext<FeatDetailContext>({
    activeTab: {
        index: 0,
        name: TableView.CLIENT,
    },
    setActiveTab: () => {},
    configExpanded: [],
    dispatchConfigExpanded: () => {},
    handleFeatureUpdate: () => {},
});

export default FeatureDetailContext;
