// import MUI Components
import FilterAltSharpIcon from "@mui/icons-material/FilterAltSharp";
import MuiDrawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { SidebarProps } from "types/componentProps.types";
import { useContext } from "react";
import AppContext from "context/AppContext";
import IDComboSelect from "./IDComboSelect";

/**
 * Sidebar component. The two properties clients and setFilteredClients are just passed to IDComboSelect.
 * @constructor
 */
function Sidebar({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setFeatureStatus,
}: SidebarProps) {
    const {
        clients,
        filteredClients,
        setFilteredClients,
        featureList,
        filteredFeatures,
        setFilteredFeatures,
    } = useContext(AppContext);
    return (
        <MuiDrawer variant="permanent">
            <Toolbar className="toolbarTitle" disableGutters>
                <FilterAltSharpIcon fontSize="inherit" />{" "}
                <Typography marginLeft={1} variant="h6">
                    Filter
                </Typography>
            </Toolbar>
            <IDComboSelect
                values={clients}
                title="Mandant"
                placeholder="Name / clientId"
                filteredValues={filteredClients}
                setFilteredValues={setFilteredClients}
                showId
            />

            <IDComboSelect
                values={featureList}
                title="Einstellung"
                placeholder="z.B. AdDefend, CleverPush Anmelde-Widget"
                filteredValues={filteredFeatures}
                setFilteredValues={setFilteredFeatures}
                showId={false}
            />

            {/* <IDRadioGroup setFeatureStatus={setFeatureStatus} /> */}
        </MuiDrawer>
    );
}

export default Sidebar;
