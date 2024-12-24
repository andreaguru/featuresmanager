import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import IDInfoButton from "components/shared/IDInfoButton";
import { ThemeProvider } from "@mui/system";
import edidTheme from "../themes/edid";

jest.mock("services/DashboardAPI");

const menuItemsWithoutFeedback = ["Farben und Icons", "Ausspielung"];

test("Popover is opened on button click", () => {
    render(
        <ThemeProvider theme={edidTheme}>
            <IDInfoButton />
        </ThemeProvider>,
    );
    // first check that popover content is not present
    expect(screen.queryByText("Farben und Icons")).not.toBeInTheDocument();
    // after click, the menu inside the popover is rendered
    fireEvent.click(screen.getByRole("button"));
    expect(screen.queryByText("Farben und Icons")).toBeInTheDocument();
});

test.each(menuItemsWithoutFeedback)(
    "Popover menu - click on item opens relative content",
    (menuItem) => {
        render(
            <ThemeProvider theme={edidTheme}>
                <IDInfoButton />
            </ThemeProvider>,
        );
        // after click, the menu inside the popover is rendered
        fireEvent.click(screen.getByRole("button"));
        // select the menu item linked to Farben und Icons section
        const colorsMenuItem = screen
            .getByText(menuItem)
            .closest(".MuiMenuItem-root") as HTMLElement;
        fireEvent.click(colorsMenuItem);
        // check if Farben und Icons section is rendered
        expect(screen.queryByRole("heading", { level: 1 })).toHaveTextContent(menuItem);
    },
);

test.each(menuItemsWithoutFeedback)("click on Übersicht opens again the menu", (menuItem) => {
    render(
        <ThemeProvider theme={edidTheme}>
            <IDInfoButton />
        </ThemeProvider>,
    );
    // after click, the menu inside the popover is rendered
    fireEvent.click(screen.getByRole("button"));
    // select the menu item linked to Farben und Icons section
    const colorsMenuItem = screen.getByText(menuItem).closest(".MuiMenuItem-root") as HTMLElement;
    fireEvent.click(colorsMenuItem);
    const overViewButton = screen.getByText("Übersicht");
    fireEvent.click(overViewButton);
    // check if Menu is rendered again
    expect(document.querySelectorAll(".MuiList-root").length).toBe(1);
});
