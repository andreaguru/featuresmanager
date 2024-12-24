import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import MainContent from "components/MainContent";
import { ThemeProvider } from "@mui/material/styles";
import AppContext from "context/AppContext";
import { act } from "react-dom/test-utils";
import edidTheme from "../themes/edid";
import { mockedClientList, mockedFeatures, mockedFilteredList } from "./mockData";

jest.mock("react-intersection-observer", () => ({
    useInView: () => [() => null, true], // Second value in array will be treated as 'inView
}));
jest.mock("next/router", () => jest.requireActual("next-router-mock"));

const showSelectedFeatures = jest.fn();
showSelectedFeatures.mockReturnValue(mockedFeatures);

describe("MainContent", () => {
    test("component contains no CliendCard if clientList and filteredClientList are empty", () => {
        const { container } = render(
            <AppContext.Provider
                value={{
                    filteredClients: [],
                    filteredFeatures: [],
                    setFilteredClients(): void {},
                    setFilteredFeatures(): void {},
                    setClientIdInView: () => {},
                    clients: [],
                    setClients: () => {},
                    featureList: [],
                    showSelectedFeatures: () => [],
                    clientsLoading: false,
                }}
            >
                <MainContent />
            </AppContext.Provider>,
        );

        expect(container.getElementsByClassName("MuiCard-root").length).toBe(0);
    });

    test("component shows CliendCards if it is passed in the props", () => {
        const { container } = render(
            <ThemeProvider theme={edidTheme}>
                <AppContext.Provider
                    value={{
                        filteredClients: [],
                        filteredFeatures: [],
                        setFilteredClients(): void {},
                        setFilteredFeatures(): void {},
                        setClientIdInView: () => {},
                        clients: mockedClientList,
                        setClients: () => {},
                        featureList: [],
                        showSelectedFeatures,
                        clientsLoading: false,
                    }}
                >
                    <MainContent />
                </AppContext.Provider>
            </ThemeProvider>,
        );

        expect(container.getElementsByClassName("MuiCard-root").length).toBeGreaterThan(0);
    });

    test("component shows filteredClientList instead of clientList if filteredClientList is not empty", async () => {
        await act(async () => {
            render(
                <ThemeProvider theme={edidTheme}>
                    <AppContext.Provider
                        value={{
                            filteredClients: mockedFilteredList,
                            filteredFeatures: [],
                            setFilteredClients(): void {},
                            setFilteredFeatures(): void {},
                            setClientIdInView: () => {},
                            clients: mockedClientList,
                            setClients: () => {},
                            featureList: [],
                            showSelectedFeatures,
                            clientsLoading: false,
                        }}
                    >
                        <MainContent />
                    </AppContext.Provider>
                </ThemeProvider>,
            );
        });

        // Wetterauer Zeitung is present in the clientList but not in the filteredClientList
        expect(screen.queryByText(/BlickPunkt Nienburg/i)).toBeInTheDocument();
        expect(screen.queryByText(/Wetterauer Zeitung/i)).not.toBeInTheDocument();
    });
});

// UNIT TESTS
