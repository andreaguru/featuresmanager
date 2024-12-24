import { styled } from "@mui/material/styles";
import { Alert, AlertProps, alpha } from "@mui/material";

const IDAlert = styled(Alert)<AlertProps>(({ theme }) => ({
    display: "inline-flex",
    backgroundColor: alpha(theme.palette.secondary.main, 0.04),
    lineHeight: 0,
    alignItems: "center",
    padding: theme.spacing(1),
    "& .MuiAlert-icon, .MuiAlert-message": {
        padding: 0,
        color: theme.palette.secondary.main,
        marginRight: theme.spacing(0.5),
    },
}));

export default IDAlert;
