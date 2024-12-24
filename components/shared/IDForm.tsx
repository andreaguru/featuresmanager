import { keyframes, styled } from "@mui/material/styles";
import Form from "@rjsf/mui";
import { FormProps } from "@rjsf/core";

const IDForm = styled(Form)<FormProps>(({ theme }) => {
    const changeBackground = keyframes`
        0% {
            background-color: ${theme.palette.primary.main};
        }
        100% {
            background-color: transparent;
        }
    `;

    return {
        width: "100%",
        h2: {
            fontSize: theme.typography.subtitle1.fontSize,
            fontWeight: "500",
        },
        legend: {
            maxWidth: "100%",
        },
        // We need to hide the array titles. Unfortunately there is no direct way to select them,
        // what they have in common is the presence of an id, therefore we use it here
        ".MuiFormControl-root > .MuiBox-root[id]": {
            display: "none",
        },
        ".MuiOutlinedInput-input": {
            fontSize: theme.typography.body2.fontSize,
            paddingTop: theme.spacing(1),
            paddingBottom: theme.spacing(1),
        },
        ".MuiInputLabel-root": {
            transform: "translate(14px, -9px) scale(1)",
            fontSize: theme.typography.caption.fontSize,
        },
        ".MuiFormControlLabel-root .MuiFormControlLabel-label": {
            fontSize: theme.typography.caption.fontSize,
        },
        ".MuiBox-root": {
            cursor: "default",
            "&:hover": {
                backgroundColor: "unset",
                boxShadow: "none",
            },
        },
        ".MuiGrid-container.MuiGrid-root": {
            marginTop: "0 !important",
        },
        ".highlight": {
            animation: `${changeBackground} 2s forwards`,
        },
    };
});

export default IDForm;
