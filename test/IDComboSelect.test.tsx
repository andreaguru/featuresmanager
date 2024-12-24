import { fireEvent, render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import IDComboSelect from "components/IDComboSelect";
import { ThemeProvider } from "@mui/system";
import { mockedClientList } from "./mockData";
import edidTheme from "../themes/edid";

const setFilteredValues = jest.fn();

test("checkbox components are not rendered at page load", () => {
    render(
        <IDComboSelect
            values={mockedClientList}
            title="Test"
            filteredValues={[]}
            placeholder="Test"
            setFilteredValues={() => null}
        />,
    );

    expect(screen.queryByTestId("241")).toBeFalsy();
});

test("placeholder is set and visible on rendered component", () => {
    render(
        <IDComboSelect
            values={mockedClientList}
            title="Test"
            filteredValues={[]}
            placeholder="Test"
            setFilteredValues={() => null}
        />,
    );

    expect(screen.getByText("Test")).toBeInTheDocument();
});

test("checkbox components are rendered after select change", () => {
    render(
        <ThemeProvider theme={edidTheme}>
            <IDComboSelect
                values={mockedClientList}
                title="Test"
                filteredValues={[]}
                placeholder="test"
                setFilteredValues={() => null}
            />
        </ThemeProvider>,
    );

    // focus on autocomplete and type "abc" as sample text
    const autocomplete = screen.getByTestId("combobox");
    const input = within(autocomplete).getByRole("combobox");
    autocomplete.focus();
    fireEvent.change(input, { target: { value: "abc" } });

    expect(screen.queryByTestId("241")).toBeInTheDocument();
});

test("handleChange behavior - setFilteredValues is called when a combobox option is clicked", () => {
    render(
        <ThemeProvider theme={edidTheme}>
            <IDComboSelect
                values={mockedClientList}
                title="Test"
                filteredValues={[]}
                placeholder="Test"
                setFilteredValues={setFilteredValues}
            />
        </ThemeProvider>,
    );

    // focus on autocomplete and type "BlickPunkt" as text in order to retrieve the mocked value
    const autocomplete = screen.getByTestId("combobox");
    const input = within(autocomplete).getByRole("combobox");
    autocomplete.focus();
    fireEvent.change(input, { target: { value: "BlickPunkt" } });
    fireEvent.click(screen.getByText("BlickPunkt Nienburg"));

    expect(setFilteredValues).toHaveBeenCalled();
});

/* Unit Tests */
