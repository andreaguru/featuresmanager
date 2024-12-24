import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";

const ModalButtonsContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "flex-end",
    gap: theme.spacing(1),
}));

export default ModalButtonsContainer;
