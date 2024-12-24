import { Typography } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";

// import typescript Interfaces
import { Client } from "types/api.types";
import { useContext } from "react";
import AppContext from "context/AppContext";
import ClientCard from "./ClientCard";

// import custom components
import IDInfoButton from "./shared/IDInfoButton";

/**
 * MainContent function is responsible for rendering the main content section of the application.
 * It displays a list of clients based on the current filter status.
 */
function MainContent() {
    const theme = useTheme();
    const { clients, clientsLoading, filteredClients } = useContext(AppContext);

    /* filter the clients that have to be shown, according to current filter status */
    /**
     * shownClients
     * @return {Array<Client>}
     */
    function shownClients(): Array<Client> {
        return filteredClients.length ? filteredClients : clients;
    }

    return (
        <>
            <Box paddingBottom={theme.spacing(3)}>
                <Typography variant="h6" component="h6">
                    Mandanten
                </Typography>
                <Typography variant="body1" component="p">
                    {shownClients().length} von {clients.length}
                </Typography>
            </Box>
            <IDInfoButton align="right" />
            {
                /* if loading is in progress, show the placeholder elements.
            Placeholders height is the same as ClientCard */
                clientsLoading && (
                    <>
                        <Skeleton
                            variant="rounded"
                            height={theme.spacing(theme.custom.clientCardHeight)}
                        />
                        <Skeleton
                            variant="rounded"
                            height={theme.spacing(theme.custom.clientCardHeight)}
                        />
                    </>
                )
            }
            {
                /* if loading process is done, show the client list */
                !clientsLoading &&
                    shownClients().map((client: Client) => (
                        <ClientCard key={client.id} client={client} />
                    ))
            }
        </>
    );
}

export default MainContent;
