import React from "react";
import "@testing-library/jest-dom";
import { fireEvent, render } from "@testing-library/react";
import UsagesTable from "components/detailPage/UsagesTable";
import { StatusValue, TableView } from "types/api.types";
import { IDDataGridProps } from "types/componentProps.types";

/**
 * The test case focuses on validating whether
 * UsagesTable function is returning the expected outputs.
 */
describe("IDDataGrid", () => {
    let componentProps: IDDataGridProps;
    beforeEach(async () => {
        componentProps = {
            usages: [
                {
                    id: {
                        clientId: 0,
                        categoryId: 123,
                        tagId: 0,
                        configurationId: 11,
                    },
                    active: true,
                },
            ],
            tableView: TableView.CLIENT,
            status: StatusValue.ENABLED,
            getCategoryName: jest.fn().mockReturnValue("Category Name"),
            getTagName: jest.fn().mockReturnValue("Tag Name"),
        };
    });

    const renderComponent = ({
        usages,
        status,
        getCategoryName,
        getTagName,
        tableView,
    }: IDDataGridProps) =>
        render(
            <UsagesTable
                usages={usages}
                tableView={tableView}
                status={status}
                getCategoryName={getCategoryName}
                getTagName={getTagName}
            />,
        );

    it("should be able to render the common Headers", () => {
        const { getByText } = renderComponent(componentProps);
        expect(getByText("Status")).toBeInTheDocument();
        expect(getByText("Konfiguration")).toBeInTheDocument();
        expect(getByText("Zuletzt geändert")).toBeInTheDocument();
    });

    it("should retrieve Category Header in the Table", () => {
        componentProps.tableView = TableView.CATEGORY;
        const { getByText } = renderComponent(componentProps);
        expect(getByText("Kategorie")).toBeInTheDocument();
        expect(getByText("Kategorie Id")).toBeInTheDocument();
    });

    it("should retrieve Tag Header in the Table", () => {
        componentProps.tableView = TableView.TAG;
        const { getByText } = renderComponent(componentProps);
        expect(getByText("Tag")).toBeInTheDocument();
        expect(getByText("Tag Id")).toBeInTheDocument();
    });

    it('should call handleOpen when "Speichern" button is clicked', () => {
        const { getByText, queryByText } = renderComponent(componentProps);
        expect(
            queryByText(/Willst du die Konfiguration auf dem gesamten Mandanten wirklich/i),
        ).not.toBeInTheDocument();
        fireEvent.click(getByText("Speichern"));
        expect(
            queryByText(/Willst du die Konfiguration auf dem gesamten Mandanten wirklich/i),
        ).toBeInTheDocument();
    });

    // Test the case where `usages` prop is an empty array. The component should correctly handle this edge case.
    it("should correctly handle empty usages", () => {
        const emptyProps = { ...componentProps, usages: [] };
        const { queryByText } = renderComponent(emptyProps);
        // You may have a placeholder text when there's no data. Here "Keine Daten" is used as an example.
        expect(
            queryByText(
                "Für diesen Bereich gibt es noch keine Einträge. Legen Sie eine Konfiguration an, um loszustarten.",
            ),
        ).toBeInTheDocument();
    });
});
