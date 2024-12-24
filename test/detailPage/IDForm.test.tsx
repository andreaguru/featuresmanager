import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import FormConfiguration from "components/detailPage/FormConfiguration";

// eslint-disable-next-line import/no-unresolved
import { JSONSchema7TypeName } from "json-schema";

describe("<FormConfiguration/>", () => {
    const mockProps = {
        id: 1,
        name: "Test Form",
        clientId: 1234,
    };

    const { id, name, clientId } = mockProps;

    const jsonSchema = {
        type: "object" as JSONSchema7TypeName,
        properties: {
            logoUrl: {
                type: ["string" as JSONSchema7TypeName, "null" as JSONSchema7TypeName],
                title: "Logo-Link-URL (falls abweichend von Startseite)",
                format: "uri-reference",
            },
            actionLinks: {
                type: "array" as JSONSchema7TypeName,
                items: {
                    $ref: "#/definitions/linkElement",
                },
                title: "Actions",
            },
        },
        definitions: {
            linkElement: {
                type: "object" as JSONSchema7TypeName,
                allOf: [
                    {
                        properties: {
                            elementType: {
                                const: "TEXT_LINK",
                            },
                        },
                    },
                ],
            },
        },
        additionalProperties: false,
    };

    const settings = {
        logoUrl: null,
        actionLinks: [
            {
                url: null,
                order: 0,
                elementType: "TEXT_LINK",
            },
            {
                url: "http://www.test.media",
                order: 1,
                elementType: "TEXT_LINK",
            },
        ],
    };

    test("renders correctly", () => {
        render(
            <FormConfiguration
                id={id}
                name={name}
                clientId={clientId}
                jsonSchema={jsonSchema}
                settings={settings}
            />,
        );
        const arrayTemp = screen.queryByTestId("templateArray");
        expect(arrayTemp).toBeInTheDocument();
    });

    it("changes editMode on click on Edit icon", async () => {
        render(
            <FormConfiguration
                id={id}
                name={name}
                clientId={clientId}
                jsonSchema={jsonSchema}
                settings={settings}
            />,
        );
        const editButton = screen.getByTestId("editConfig");
        expect(screen.queryByText(/Speichern/i)).not.toBeInTheDocument();
        fireEvent.click(editButton);
        expect(screen.queryByText(/Speichern/i)).toBeInTheDocument();
    });

    it("modal window is shown on click on reset button", async () => {
        render(
            <FormConfiguration
                id={id}
                name={name}
                clientId={clientId}
                jsonSchema={jsonSchema}
                settings={settings}
            />,
        );
        const editButton = screen.getByTestId("editConfig");
        fireEvent.click(editButton);

        const resetButton = screen.getByTestId("resetForm");
        fireEvent.click(resetButton);
        expect(
            screen.queryByText(/Möchten Sie Ihre Änderungen wirklich zurücksetzen/i),
        ).toBeInTheDocument();
    });
});
