import { styled } from "@mui/material/styles";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { alpha } from "@mui/material";

const IDHelpIcon = styled(HelpOutlineIcon)(({ theme }) => ({
    color: alpha(theme.palette.secondary.main, 0.6),
    marginLeft: 0.5,
    fontSize: theme.typography.body2.fontSize,
    cursor: "pointer",
    verticalAlign: "5px",
    "&:hover": {
        color: theme.palette.secondary.main,
    },
}));

export default IDHelpIcon;
