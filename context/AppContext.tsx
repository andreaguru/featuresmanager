import { createContext } from "react";
import { GlobalContext } from "types/context.types";

/**
 * The AppContext variable represents a React context object that provides a global state and functionality to
 * the components in the application.
 *
 * @type {React.Context<GlobalContext>}
 * @property {Function} setClientIdInView - A function to set the client ID in view.
 * @property {Array} clients - An array of client objects.
 * @property {Function} setClients - A function to update the clients array.
 * @property {Array} filteredClients - An array of client objects after applying filters.
 * @property {Function} setFilteredClients - A function to update the filteredClients array.
 * @property {Array} featureList - An array of feature objects.
 * @property {Array} filteredFeatures - An array of feature objects after applying filters.
 * @property {Function} setFilteredFeatures - A function to update the filteredFeatures array.
 * @property {Function} showSelectedFeatures - A function to show the selected features.
 * @property {boolean} clientsLoading - A boolean value indicating if the clients are still loading.
 */
const AppContext = createContext<GlobalContext>({
    setClientIdInView: () => {},
    clients: [],
    setClients: () => {},
    filteredClients: [],
    setFilteredClients: () => {},
    featureList: [],
    filteredFeatures: [],
    setFilteredFeatures: () => {},
    showSelectedFeatures: () => [],
    clientsLoading: true,
});

export default AppContext;
