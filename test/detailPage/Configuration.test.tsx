import { act, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Configuration from "components/detailPage/Configuration";
import { ThemeProvider } from "@mui/system";
import FeatureDetailContext from "context/FeatureDetailContext";
import { TableView } from "types/api.types";
import edidTheme from "../../themes/edid";

jest.mock("services/DashboardAPI");

const config = {
    created: "",
    modified: "",
    name: "",
    id: 0,
    clientId: 0,
    settings: {},
};

const toggleConfig = jest.fn();

test("Toggle has class disabled when disabled property is passed", () => {
    render(
        <ThemeProvider theme={edidTheme}>
            <Configuration
                featureKey="footer"
                jsonSchema={null}
                disabled
                toggleConfig={toggleConfig}
            />
        </ThemeProvider>,
    );
    // first check if the component has class disabled
    expect(screen.getByTestId("toggle").classList.contains("Mui-disabled")).toBe(true);
});

test("Toggle is expanded if config id is present in configExpanded array", async () => {
    render(
        <ThemeProvider theme={edidTheme}>
            <FeatureDetailContext.Provider
                value={{
                    activeTab: { index: 0, name: TableView.CLIENT },
                    setActiveTab: () => {},
                    configExpanded: [0],
                    handleFeatureUpdate: () => {},
                    dispatchConfigExpanded: jest.fn(),
                }}
            >
                <Configuration
                    featureKey="footer"
                    jsonSchema={{}}
                    toggleConfig={toggleConfig}
                    config={config}
                />
            </FeatureDetailContext.Provider>
        </ThemeProvider>,
    );
    await act(async () => {
        fireEvent.click(screen.getByTestId("toggleButton"));
    });
    expect(screen.queryByTestId("collapsedContent")).toBeInTheDocument();
});

test("Toggle is collapsed if config id is not present in configExpanded array", async () => {
    render(
        <ThemeProvider theme={edidTheme}>
            <FeatureDetailContext.Provider
                value={{
                    activeTab: { index: 0, name: TableView.CLIENT },
                    setActiveTab: () => {},
                    configExpanded: [],
                    handleFeatureUpdate: () => {},
                    dispatchConfigExpanded: jest.fn(),
                }}
            >
                <Configuration
                    featureKey="footer"
                    jsonSchema={{}}
                    toggleConfig={toggleConfig}
                    config={config}
                />
            </FeatureDetailContext.Provider>
        </ThemeProvider>,
    );
    await act(async () => {
        fireEvent.click(screen.getByTestId("toggleButton"));
    });
    // test that client list returns an array with 4 values
    expect(screen.queryByTestId("collapsedContent")).not.toBeInTheDocument();
});
