import "@testing-library/jest-dom";
import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { ThemeProvider } from "@mui/system";
import FormAddUsage from "components/detailPage/FormAddUsage";
import edidTheme from "../../themes/edid";

describe("FormAddUsage Tests", () => {
    test("When the API succeeds and no error is returned, the error alert is not shown", async () => {
        // Mock a 500 server error as answer of the fetch call
        global.fetch = jest
            .fn()
            .mockImplementation(jest.fn(() => Promise.resolve({ ok: true })) as jest.Mock);

        render(
            <ThemeProvider theme={edidTheme}>
                <FormAddUsage
                    configId={123}
                    closeModal={() => {}}
                    setShowSuccessMessage={() => {}}
                />
            </ThemeProvider>,
        );
        const configField = screen.getByLabelText(/Konfiguration/i);
        const level = screen.getByText(/Mandant/i);
        const levelId = screen.getByLabelText(/client-ID/i);
        fireEvent.change(configField, { target: { value: "1234" } });
        fireEvent.click(level);
        fireEvent.change(levelId, { target: { value: 123 } });
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
                <FormAddUsage
                    configId={123}
                    closeModal={() => {}}
                    setShowSuccessMessage={() => {}}
                />
            </ThemeProvider>,
        );
        const configField = screen.getByLabelText(/Konfiguration/i);
        const level = screen.getByText(/Mandant/i);
        const levelId = screen.getByLabelText(/client-ID/i);
        fireEvent.change(configField, { target: { value: "1234" } });
        fireEvent.click(level);
        fireEvent.change(levelId, { target: { value: 123 } });
        await act(async () => {
            fireEvent.click(screen.getByTestId("submit"));
        });
        expect(screen.getByTestId("errorMessage")).toHaveTextContent(
            "Für diesen Mandanten wurde bereits eine Usage angelegt.",
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
                <FormAddUsage
                    configId={123}
                    closeModal={() => {}}
                    setShowSuccessMessage={() => {}}
                />
            </ThemeProvider>,
        );
        const configField = screen.getByLabelText(/Konfiguration/i);
        const level = screen.getByText(/Mandant/i);
        const levelId = screen.getByLabelText(/client-ID/i);
        fireEvent.change(configField, { target: { value: "1234" } });
        fireEvent.click(level);
        fireEvent.change(levelId, { target: { value: 123 } });
        await act(async () => {
            fireEvent.click(screen.getByTestId("submit"));
        });
        expect(screen.getByTestId("errorMessage")).toHaveTextContent(
            "Die Usage wurde nicht hinzugefügt. Versuchen Sie es noch einmal.",
        );
    });
});
