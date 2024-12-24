import React, { ReactElement, useState } from "react";
import { ArrayFieldTemplateItemType, ArrayFieldTemplateProps } from "@rjsf/utils";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useTheme } from "@mui/material/styles";

/**
 * Renders an array field template.
 *
 * @return {JSX.Element} The rendered array field template.
 */
export default function ArrayFieldTemplate(props: ArrayFieldTemplateProps): ReactElement {
    const { className, items, canAdd, onAddClick, title } = props;
    const [focusedItemIndex, setFocusedItemIndex] = useState<number>();
    const [triggerRender, setTriggerRender] = useState<boolean>(false);
    const theme = useTheme();

    /**
     * Moves the specified array element to a new index in the array.
     *
     * @return {void}
     */
    function moveArrayElement(element: ArrayFieldTemplateItemType, newIndex: number) {
        setFocusedItemIndex(newIndex);
        setTriggerRender((prev) => !prev);
        element.onReorderClick(element.index, newIndex)();
    }

    /**
     * Returns the class name for a given index.
     * @return {string} - The class "highlight" if the focusedItemIndex is equal to the given index.
     */
    function getHighlightClassName(index: number) {
        return focusedItemIndex === index ? "highlight" : "";
    }

    return (
        /* We generate a new key in order to always trigger
        a re-render of the element and therefore show the highlight animation */
        <div className={className} data-testid="templateArray">
            <h2>{title}</h2>
            {items &&
                items.map((element, index) => (
                    <Paper
                        /* eslint-disable-next-line react/no-array-index-key */
                        key={`${index}-${triggerRender}`} // we use it to force React to render the component
                        // every time triggerRender changes, so that the CSS animation become visible
                        className={getHighlightClassName(index)}
                        sx={{ p: theme.spacing(1), mb: theme.spacing(2) }}
                    >
                        {element.children}
                        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                            {element.hasMoveUp && (
                                <IconButton
                                    onClick={() => moveArrayElement(element, element.index - 1)}
                                >
                                    <ArrowUpwardIcon color="id_mediumGray" />
                                </IconButton>
                            )}
                            {element.hasMoveDown && (
                                <IconButton
                                    onClick={() => moveArrayElement(element, element.index + 1)}
                                >
                                    <ArrowDownwardIcon color="id_mediumGray" />
                                </IconButton>
                            )}
                            {element.hasRemove && (
                                <IconButton
                                    onClick={() => {
                                        setFocusedItemIndex(element.index);
                                        element.onDropIndexClick(element.index)();
                                    }}
                                >
                                    <DeleteIcon color="id_mediumGray" />
                                </IconButton>
                            )}
                        </Box>
                    </Paper>
                ))}

            {canAdd && (
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <IconButton
                        onClick={() => {
                            setFocusedItemIndex(items.length);
                            onAddClick();
                        }}
                    >
                        <AddIcon color="primary" />
                    </IconButton>
                </Box>
            )}
        </div>
    );
}
