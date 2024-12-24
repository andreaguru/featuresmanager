import { UiSchema } from "@rjsf/utils";
import ConfigFixedInfosWrapper from "components/shared/ConfigFixedInfosWrapper";

const getUiSchema = (editMode: boolean): UiSchema => ({
    "ui:globalOptions": {
        addable: editMode,
        orderable: editMode,
        removable: editMode,
    },
    configFixedInfosWrapper: {
        "ui:ObjectFieldTemplate": ConfigFixedInfosWrapper,
    },
    "ui:submitButtonOptions": { norender: !editMode },
    "ui:options": {
        buttonConfirmText: "Custom Submit Text",
    },
    actionLinks: {
        items: {
            "ui:order": ["elementType", "linkName", "url", "modifierClassExtension"],
        },
    },
    featuredLinks: {
        items: {
            "ui:order": ["elementType", "linkName", "url", "modifierClassExtension"],
        },
    },
});

export default getUiSchema;
