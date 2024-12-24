import { EmotionJSX } from "@emotion/react/types/jsx-namespace";

// import typescript Interfaces
import { TableView, Usage } from "types/api.types";
import Chip from "@mui/material/Chip";
import edid from "../themes/edid";

/**
 * getIconColorByStatus - return the right icon color according to client, category or tag status
 * @param {string} status
 * @return {string}
 */
export function getIconColorByStatus(status: string) {
    switch (status) {
        case "ENABLED":
            return edid.palette.id_green.main; // #319E7D
        case "DISABLED":
            return edid.palette.id_red.main; // #F15653
        case "ENABLED_AND_DISABLED":
            return edid.palette.id_orange.main; // #FDAD0D
        case "NONE":
        default:
            return edid.palette.id_lightGray.main; // #A5A5A5
    }
}

/**
 * getUsageStatusColor
 * @param {Array<Usage>} usages
 * @return {string}
 */
export function getUsageStatusColor(usages: Array<Usage>) {
    const activeUsages = usages.filter((usage) => usage.active);
    const inactiveUsages = usages.filter((usage) => !usage.active);

    if (activeUsages.length && inactiveUsages.length) {
        return "id_orange";
    }
    if (activeUsages.length && !inactiveUsages.length) {
        return "id_green";
    }
    if (!activeUsages.length && inactiveUsages.length) {
        return "id_red";
    }
    // by default show aktiviert and deaktiviert with value 0
    return "id_lightGray";
}

/**
 * getSelectedUsages
 * @param {Array<Usage>} usages
 * @param {TableView} tableView
 * @return {Array<Usage>}
 */
export function getSelectedUsages(usages: Array<Usage>, tableView: TableView) {
    if (tableView === TableView.CLIENT) {
        return usages.filter((usage) => usage.id.clientId !== 0);
    }
    if (tableView === TableView.CATEGORY) {
        return usages.filter((usage) => usage.id.categoryId !== 0);
    }
    if (tableView === TableView.TAG) {
        return usages.filter((usage) => usage.id.tagId !== 0);
    }
    return usages;
}

/**
 * showUsageLabel
 * show the labels with the current status of the usages for a
 * specific configuration (how many active and not active usages are present). See Layout:
 * https://xd.adobe.com/view/e54d650f-8015-409d-bb4f-ee719174d24f-b01e/screen/539745da-91b3-4099-b696-7a3efb4c0ebe/
 * @param {Array<Usage>} usages
 * @return {EmotionJSX.Element[]}
 */
export function showUsageLabel(usages: Array<Usage>) {
    /**
     * renderUsageStatus
     * In this function we render the two components (active and inactive) wit the infos that they have to show
     * We use an extra function in order to not repeat the code
     * @param {number} activeLength
     * @param {number} inactiveLength
     * @return {EmotionJSX.Element[]}
     */
    function renderUsageStatus(activeLength: number, inactiveLength: number): EmotionJSX.Element[] {
        return [
            <Chip
                key="1"
                label={`aktiviert ${activeLength}`}
                disabled={activeLength === 0}
                size="small"
                sx={{
                    color: "id_green.main",
                    bgcolor: "id_green.light",
                }}
            />,
            <Chip
                key="2"
                label={`deaktiviert ${inactiveLength}`}
                disabled={inactiveLength === 0}
                size="small"
                sx={{
                    color: "id_red.main",
                    bgcolor: "id_red.light",
                }}
            />,
        ];
    }

    const activeUsages = usages.filter((usage) => usage.active);
    const inactiveUsages = usages.filter((usage) => !usage.active);
    return renderUsageStatus(activeUsages.length, inactiveUsages.length);
}

/**
 * Convert a given string value to a formatted date and time string based on the specified language and format options.
 *
 * @param {string} value - The string value representing a date.
 * @param {string} lang - The language code for localizing the date string.
 * @param {Intl.DateTimeFormatOptions} dateFormat - The format options for formatting the date string.
 *
 * @return {string} - The formatted date and time string.
 */
export function dateTimeFormatter(
    value: string,
    lang: string,
    dateFormat: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    },
) {
    return new Date(value).toLocaleDateString(lang, dateFormat);
}

// Basic fetcher used for SWR
export const fetcher = (url: string) => fetch(url).then((res) => res.json());
