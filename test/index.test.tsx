import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ThemeProvider } from "@mui/material/styles";
import AppContext from "context/AppContext";
import edidTheme from "../themes/edid";
import { mockedClientList, mockedFeatures } from "./mockData";
import Home from "../pages";

jest.mock("services/DashboardAPI", () => ({
    useFeaturesPerClient: jest.fn(() => mockedFeatures),
}));

const setFilteredValues = jest.fn();

const showSelectedFeatures = jest.fn();
showSelectedFeatures.mockReturnValue(mockedFeatures);

jest.mock("react-intersection-observer", () => ({
    useInView: () => [() => null, true], // Second value in array will be treated as 'inView
}));
jest.mock("next/router", () => jest.requireActual("next-router-mock"));

describe("Home Page", () => {
    test("client list is not present and loader is present if isLoading is true", () => {
        const { container } = render(
            <ThemeProvider theme={edidTheme}>
                <AppContext.Provider
                    value={{
                        filteredClients: [],
                        filteredFeatures: [],
                        setFilteredClients: setFilteredValues,
                        setFilteredFeatures: setFilteredValues,
                        setClientIdInView: () => {},
                        clients: [],
                        setClients: () => {},
                        featureList: mockedFeatures,
                        showSelectedFeatures,
                        clientsLoading: true,
                    }}
                >
                    <Home setFeatureStatus={setFilteredValues} />
                </AppContext.Provider>
            </ThemeProvider>,
        );
        // test that client list returns an empty array
        expect(screen.queryAllByTestId("client").length).toBe(0);
        // test that 3 loaders (Skeleton components) are present in the document,
        // two for MainContent and one for IDComboSelect
        expect(container.getElementsByClassName("MuiSkeleton-root").length).toBe(3);
    });

    test("client list is present and loader is not present if isLoading is false", () => {
        const { container } = render(
            <ThemeProvider theme={edidTheme}>
                <AppContext.Provider
                    value={{
                        filteredClients: [],
                        filteredFeatures: [],
                        setFilteredClients: setFilteredValues,
                        setFilteredFeatures: setFilteredValues,
                        setClientIdInView: () => {},
                        clients: mockedClientList,
                        setClients: () => {},
                        featureList: mockedFeatures,
                        showSelectedFeatures,
                        clientsLoading: false,
                    }}
                >
                    <Home setFeatureStatus={setFilteredValues} />
                </AppContext.Provider>
            </ThemeProvider>,
        );
        // test that client list returns an array with 4 values
        expect(screen.queryByTestId("241")).toBeInTheDocument();
        // test that loaders (Skeleton components) are not present in the document
        expect(container.getElementsByClassName("MuiSkeleton-root").length).toBe(0);
    });
});
