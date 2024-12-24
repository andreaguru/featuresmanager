import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { ReactNode } from "react";

interface IDModalButtonProps {
    size?: "small" | "medium" | "large";
    color?: "primary" | "secondary" | "error";
    type?: "button" | "submit" | "reset";
    onClick?: () => void;
    children: ReactNode;
}

// Goal is to create a custom component that has small as default value for size property
const IDModalButton = styled(
    ({ size = "small", color, onClick, type, children }: IDModalButtonProps) => (
        <Button size={size} color={color} type={type} onClick={onClick}>
            {children}
        </Button>
    ),
)``;

export default IDModalButton;
