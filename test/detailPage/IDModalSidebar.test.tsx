import { render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ThemeProvider } from "@mui/system";
import IDModalSidebar from "components/detailPage/ModalSidebar";
import { act } from "react-dom/test-utils";
import edidTheme from "../../themes/edid";
import { mockedFeatureDetailForClient } from "../mockData";

const setFeaturesDetailConfigSelected = jest.fn();

test("Configuration Box is rendered and toggle button is present", async () => {
    await act(async () => {
        render(
            <ThemeProvider theme={edidTheme}>
                <IDModalSidebar
                    featuresDetailConfig={mockedFeatureDetailForClient.configurations}
                    featureKey="cleverpush"
                    jsonSchema={{}}
                    setFeaturesDetailConfigSelected={setFeaturesDetailConfigSelected}
                />
            </ThemeProvider>,
        );
    });
    const configurationBox = screen.getAllByTestId("toggle")[0];
    const toggleButton = within(configurationBox).getByRole("button");

    expect(toggleButton).toBeInTheDocument();
});

test("Configuration Box is not rendered if no configurations are passed", async () => {
    await act(async () => {
        render(
            <ThemeProvider theme={edidTheme}>
                <IDModalSidebar
                    featuresDetailConfig={[]}
                    featureKey="cleverpush"
                    jsonSchema={{}}
                    setFeaturesDetailConfigSelected={setFeaturesDetailConfigSelected}
                />
            </ThemeProvider>,
        );
    });
    const configurationBox = screen.queryByTestId("toggle");

    expect(configurationBox).not.toBeInTheDocument();
});
