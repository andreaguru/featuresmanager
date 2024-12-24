// import utils
import {
    getIconColorByStatus,
    getSelectedUsages,
    getUsageStatusColor,
    showUsageLabel,
} from "utils/utils";
import { TableView } from "types/api.types";
import { mockedFeatureDetailForClient } from "./mockData";
import edid from "../themes/edid";

// UNIT TESTS
test("returns id_green if feature status is enabled", () => {
    const colors = getIconColorByStatus("ENABLED");
    expect(colors).toBe(edid.palette.id_green.main);
});

test("returns id_orange if status is enabled_and_disabled", () => {
    const colors = getIconColorByStatus("ENABLED_AND_DISABLED");
    expect(colors).toBe(edid.palette.id_orange.main);
});

test("returns the correct number of usages according to the mocked data", () => {
    const usagesForClient = getSelectedUsages(
        mockedFeatureDetailForClient.configurations[0].usages,
        TableView.CLIENT,
    );
    const usagesForCategory = getSelectedUsages(
        mockedFeatureDetailForClient.configurations[0].usages,
        TableView.CATEGORY,
    );
    const usagesForTag = getSelectedUsages(
        mockedFeatureDetailForClient.configurations[0].usages,
        TableView.TAG,
    );
    expect(usagesForClient.length).toBe(0);
    expect(usagesForCategory.length).toBe(2);
    expect(usagesForTag.length).toBe(0);
});

test("returns two Chip Components with 0 usages (both active and inactive)", () => {
    const labels = showUsageLabel(mockedFeatureDetailForClient.configurations[0].usages);
    expect(labels[0].props.label).toContain("aktiviert 2");
    expect(labels[1].props.label).toContain("deaktiviert 0");
});
test("returns two Chip Components with 2 usages, only active", () => {
    const labels = showUsageLabel(mockedFeatureDetailForClient.configurations[1].usages);
    expect(labels[0].props.label).toContain("aktiviert 1");
    expect(labels[1].props.label).toContain("deaktiviert 0");
});

test("return the right color according to the usages status", () => {
    // in the first mocked config all usages are active, therefore we expect a green color
    const usageStatusGreen = getUsageStatusColor(
        mockedFeatureDetailForClient.configurations[0].usages,
    );
    // in the third mocked config the only usage has active false, therefore we expect a red color
    const usageStatusGray = getUsageStatusColor(
        mockedFeatureDetailForClient.configurations[2].usages,
    );
    expect(usageStatusGreen).toBe("id_green");
    expect(usageStatusGray).toBe("id_red");
});
