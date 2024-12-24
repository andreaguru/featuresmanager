import { render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime";
import mockRouter from "next-router-mock";
import ClientCard, { getButtonColorByStatus } from "components/ClientCard";
import { ThemeProvider } from "@mui/material/styles";
import AppContext from "context/AppContext";
import edidTheme from "../themes/edid";
import { mockedClientList, mockedFeatures } from "./mockData";

jest.mock("react-intersection-observer", () => ({
    useInView: () => [() => null, true], // Second value in array will be treated as 'inView
}));
jest.mock("next/router", () => jest.requireActual("next-router-mock"));

const showSelectedFeatures = jest.fn();
showSelectedFeatures.mockReturnValue(mockedFeatures);

jest.mock("services/DashboardAPI", () => ({
    getClientList: jest.fn(() => Promise.resolve(mockedClientList)),
    useFeaturesPerClient: jest.fn(() => mockedFeatures),
}));

describe("Parameterized test for ClientCard", () => {
    const clientData = [
        {
            id: 321,
            name: "Merkur",
            features: [],
        },
        {
            id: 234,
            name: "TZ",
            features: [],
        },
        {
            id: 145,
            name: "Kreiszeitung",
            features: [],
        },
    ];

    test.each(clientData)("Client name and ID are outputted in the DOM", (clientValue) => {
        render(
            <ThemeProvider theme={edidTheme}>
                <AppContext.Provider
                    value={{
                        setClientIdInView: () => {},
                        clients: mockedClientList,
                        filteredClients: [],
                        filteredFeatures: [],
                        setFilteredClients(): void {},
                        setFilteredFeatures(): void {},
                        setClients: () => {},
                        featureList: mockedFeatures,
                        showSelectedFeatures,
                        clientsLoading: true,
                    }}
                >
                    <ClientCard client={clientValue} />
                </AppContext.Provider>
            </ThemeProvider>,
        );

        expect(screen.getByText(clientValue.name, { exact: false })).toBeInTheDocument();
        expect(screen.getByText(String(clientValue.id), { exact: false })).toBeInTheDocument();
    });

    test.each(mockedClientList)("Feature button matches color status", (clientMocked) => {
        render(
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
                        featureList: mockedFeatures,
                        showSelectedFeatures,
                        clientsLoading: true,
                    }}
                >
                    <ClientCard client={clientMocked} />
                </AppContext.Provider>
            </ThemeProvider>,
        );

        const autocomplete = screen.getByTestId(String(clientMocked.id));
        // traffective -> feature client is ENABLED
        const traffective = within(autocomplete).getAllByText(clientMocked.features[0].name, {
            exact: false,
        })[0].parentElement as HTMLElement;
        // inArticleReco -> feature client is DISABLED
        const inArticleReco = within(autocomplete).getAllByText(clientMocked.features[1].name, {
            exact: false,
        })[0].parentElement as HTMLElement;

        expect(traffective).toHaveStyle({
            color: edidTheme.palette.id_green.main,
        });

        expect(inArticleReco).toHaveStyle({
            color: edidTheme.palette.id_mediumGray.main,
        });
    });

    test.each(mockedClientList)(
        "fltr-clients query param is appended to href attr in Next Link Component",
        (clientMocked) => {
            mockRouter.push({
                query: {
                    "fltr-clients": clientMocked.id.toString(),
                },
            });
            render(
                <RouterContext.Provider value={mockRouter}>
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
                                featureList: mockedFeatures,
                                showSelectedFeatures,
                                clientsLoading: false,
                            }}
                        >
                            <ClientCard client={clientMocked} />
                        </AppContext.Provider>
                    </ThemeProvider>
                    ;
                </RouterContext.Provider>,
            );

            const autocomplete = screen.getByTestId(String(clientMocked.id));
            // get first mocked feature -> traffective
            const traffective = within(autocomplete)
                .getAllByText(clientMocked.features[0].name)[0]
                .closest("a") as HTMLElement;
            expect(traffective).toHaveAttribute(
                "href",
                // eslint-disable-next-line max-len
                `/feature/${clientMocked.id}/${clientMocked.features[0].key}?fltr-clients=${clientMocked.id}`,
            );
        },
    );
});

test("component shows no features if showSelectedFeatures returns and empty array", () => {
    render(
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
                    featureList: mockedFeatures,
                    showSelectedFeatures: () => [],
                    clientsLoading: true,
                }}
            >
                <ClientCard
                    client={{
                        id: 1,
                        name: "Test",
                        features: [],
                    }}
                />
            </AppContext.Provider>
        </ThemeProvider>,
    );

    expect(screen.queryAllByTestId("feature").length).toBe(0);
});

test("component shows features if showSelectedFeatures returns an array with values", () => {
    const showSelectedUniversalFeatures = jest.fn();
    showSelectedUniversalFeatures.mockReturnValueOnce(mockedFeatures);

    render(
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
                    featureList: mockedFeatures,
                    showSelectedFeatures: showSelectedUniversalFeatures,
                    clientsLoading: true,
                }}
            >
                <ClientCard client={mockedClientList[0]} />
            </AppContext.Provider>
        </ThemeProvider>,
    );

    // mockedFeatures contains 3 Features, we expect to have them in the DOM
    expect(screen.queryAllByTestId("feature").length).toBe(3);
});

// UNIT TESTS

test("returns id_green color if feature status is enabled", () => {
    const { color } = getButtonColorByStatus("ENABLED", edidTheme);
    expect(color).toBe(edidTheme.palette.id_green.main);
});

test("returns id_green background color if feature status is enabled", () => {
    const color = getButtonColorByStatus("ENABLED", edidTheme).bgColor;
    expect(color).toBe(edidTheme.palette.id_green.light);
});
