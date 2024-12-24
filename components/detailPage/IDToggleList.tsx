import Container from "@mui/material/Container";
import { styled } from "@mui/material/styles";

/**
 * IDToggleList component. It accepts the same parameters as MUI Container
 * @param {ContainerProps} props
 *
 * @constructor
 */
const IDToggleList = styled(Container)(({ theme }) => ({
    display: "flex",
    flexWrap: "wrap",
    overflowY: "scroll",
    gap: theme.spacing(3),
    paddingBottom: theme.spacing(3),
}));

export default IDToggleList;
