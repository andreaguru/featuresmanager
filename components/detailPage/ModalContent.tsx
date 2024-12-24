import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";

/**
 * IDModalWindow component. It accepts the same parameters as MUI Grid
 *
 * @constructor
 */
const ModalContent = styled(Grid)(({ theme }) => ({
    backgroundColor: theme.palette.grey[100],
    width: "95%",
    height: "95%",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    marginTop: 0,
    borderRadius: theme.spacing(0.5),
    paddingTop: theme.spacing(9),
}));

export default ModalContent;
