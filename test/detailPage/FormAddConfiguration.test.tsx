import "@testing-library/jest-dom";
import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { ThemeProvider } from "@mui/system";
import FormAddConfiguration from "components/detailPage/FormAddConfiguration";
import edidTheme from "../../themes/edid";

describe("FormAddConfiguration Tests", () => {
    test("Form is rendered with configName, clientId, featureId, plus the fields passed from jsonSchema", async () => {
        render(
            <ThemeProvider theme={edidTheme}>
                <FormAddConfiguration
                    jsonSchema={{
                        type: "object",
                        properties: {
                            showAuthorLinks: {
                                type: "boolean",
                                title: "Links zum Autorenprofil anzeigen",
                                default: false,
                            },
                        },
                        additionalProperties: false,
                    }}
                    closeModal={() => {}}
                />
            </ThemeProvider>,
        );

        expect(screen.getByLabelText(/Konfiguration Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Client ID/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Feature ID/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Links zum Autorenprofil anzeigen/i)).toBeInTheDocument();
    });
    test("When the API succeeds and no error is returned, the error alert is not shown", async () => {
        // Mock a 500 server error as answer of the fetch call
        global.fetch = jest.fn().mockImplementation(
            jest.fn(() =>
                Promise.resolve({
                    ok: true,
                    json: () =>
                        Promise.resolve({
                            message: "Success",
                        }),
                }),
            ) as jest.Mock,
        );

        render(
            <ThemeProvider theme={edidTheme}>
                <FormAddConfiguration
                    jsonSchema={{
                        type: "object",
                        properties: {
                            showAuthorLinks: {},
                        },
                        additionalProperties: false,
                    }}
                    closeModal={() => {}}
                />
            </ThemeProvider>,
        );
        const configName = screen.getByLabelText(/Konfiguration Name/i);
        const clientId = screen.getByLabelText(/Client ID/i);
        const featureId = screen.getByLabelText(/Feature ID/i);
        fireEvent.change(configName, { target: { value: "Test" } });
        fireEvent.change(clientId, { target: { value: 329 } });
        fireEvent.change(featureId, { target: { value: 1 } });
        await act(async () => {
            fireEvent.click(screen.getByTestId("submit"));
        });

        expect(screen.queryByTestId("errorMessage")).not.toBeInTheDocument();
    });

    test("When the API returns 500 error, the relative message is shown", async () => {
        // Mock a 500 server error as answer of the fetch call
        global.fetch = jest
            .fn()
            .mockImplementation(
                jest.fn(() => Promise.resolve({ ok: false, status: 500 })) as jest.Mock,
            );

        render(
            <ThemeProvider theme={edidTheme}>
                <FormAddConfiguration
                    jsonSchema={{
                        type: "object",
                        properties: {
                            showAuthorLinks: {},
                        },
                        additionalProperties: false,
                    }}
                    closeModal={() => {}}
                />
            </ThemeProvider>,
        );
        const configName = screen.getByLabelText(/Konfiguration Name/i);
        const clientId = screen.getByLabelText(/Client ID/i);
        const featureId = screen.getByLabelText(/Feature ID/i);
        fireEvent.change(configName, { target: { value: "Test" } });
        fireEvent.change(clientId, { target: { value: 123 } });
        fireEvent.change(featureId, { target: { value: 1 } });

        await act(async () => {
            fireEvent.click(screen.getByTestId("submit"));
        });

        expect(screen.queryByTestId("errorMessage")).toBeInTheDocument();
        expect(screen.getByTestId("errorMessage")).toHaveTextContent(
            "Die Konfiguration wurde nicht hinzugefügt. Versuchen Sie es noch einmal.",
        );
    });

    test("When the API returns 404 error, a generic server error message is shown", async () => {
        // Mock a 404 server error as answer of the fetch call
        global.fetch = jest
            .fn()
            .mockImplementation(
                jest.fn(() => Promise.resolve({ ok: false, status: 404 })) as jest.Mock,
            );

        render(
            <ThemeProvider theme={edidTheme}>
                <FormAddConfiguration
                    jsonSchema={{
                        type: "object",
                        properties: {
                            showAuthorLinks: {},
                        },
                        additionalProperties: false,
                    }}
                    closeModal={() => {}}
                />
            </ThemeProvider>,
        );
        const configName = screen.getByLabelText(/Konfiguration Name/i);
        const clientId = screen.getByLabelText(/Client ID/i);
        const featureId = screen.getByLabelText(/Feature ID/i);
        fireEvent.change(configName, { target: { value: "Test" } });
        fireEvent.change(clientId, { target: { value: 123 } });
        fireEvent.change(featureId, { target: { value: 1 } });

        await act(async () => {
            fireEvent.click(screen.getByTestId("submit"));
        });

        expect(screen.getByTestId("errorMessage")).toHaveTextContent(
            "Die Konfiguration wurde nicht hinzugefügt. Versuchen Sie es noch einmal.",
        );
    });
});
