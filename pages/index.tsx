// import MUI Components
import MuiAppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import { styled } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";

// import custom Components
import Image from "next/legacy/image";
import { ReactElement } from "react";
import Logo from "assets/logo.svg";
import MainContent from "components/MainContent";
import Sidebar from "components/Sidebar";
import { HomeProps } from "types/componentProps.types";

const AppContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    paddingTop: theme.spacing(9),
}));

/**
 * The Home Page. This is currently the only page of the project.
 * Here are declared the states that are used throughout the App.
 * The states can be updated via setters (e.g. setClients).
 * The setters can be passed as props to children components and called from there.
 * In useEffect we retrieve the infos that are needed when the App is loaded.
 *
 * @constructor
 */
function Home({ setFeatureStatus, isDetailPage, children }: HomeProps): ReactElement {
    return (
        <>
            <CssBaseline />
            {/* use the variable declared in the createTheme to get the height of the header */}
            <AppContainer>
                <MuiAppBar>
                    <Toolbar className="mainToolbar">
                        <List component="nav">
                            <Image alt="" layout="fixed" src={Logo} width={125} height={52} />
                        </List>
                    </Toolbar>
                </MuiAppBar>
                <Sidebar setFeatureStatus={setFeatureStatus} />

                {!isDetailPage && (
                    <Container component="main" className="mainContent" maxWidth={false}>
                        <Grid item xs={12}>
                            <MainContent />
                        </Grid>
                    </Container>
                )}
            </AppContainer>
            {children}
        </>
    );
}

export default Home;
