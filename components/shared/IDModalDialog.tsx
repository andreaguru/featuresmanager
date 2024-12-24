import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";

// types
import { IDModalProps } from "types/componentProps.types";

const IDStyledModalDialog = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    boxShadow: "24",
    padding: theme.spacing(3),
    maxHeight: `calc(100vh - ${theme.spacing(8)})`,
    maxWidth: theme.spacing(76),
    overflow: "auto",
}));

/**
 * Opens a modal window with customized style
 */
function IDModalDialog({
    modalOpen,
    modalWidth,
    handleClose,
    titleText,
    descriptionText,
    textAlign,
    children,
}: IDModalProps) {
    return (
        <Modal aria-labelledby="modal-title" open={modalOpen} onClose={handleClose}>
            <IDStyledModalDialog width={modalWidth} textAlign={textAlign}>
                {titleText && (
                    <Typography
                        id="modal-modal-title"
                        variant="h6"
                        dangerouslySetInnerHTML={{ __html: titleText }}
                    />
                )}
                {descriptionText && (
                    <Typography
                        id="modal-modal-description"
                        variant="body2"
                        dangerouslySetInnerHTML={{ __html: descriptionText }}
                    />
                )}
                {children}
            </IDStyledModalDialog>
        </Modal>
    );
}

export default IDModalDialog;
