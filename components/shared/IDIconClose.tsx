import { styled } from "@mui/material/styles";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const IDSytledIconClose = styled(IconButton)(({ theme }) => ({
    position: "absolute",
    top: theme.spacing(3),
    right: theme.spacing(3),
    padding: 0,
}));

function IDIconClose({ size, color, onClick }: IconButtonProps) {
    return (
        <IDSytledIconClose size={size} color={color} onClick={onClick}>
            <CloseIcon />
        </IDSytledIconClose>
    );
}

export default IDIconClose;
