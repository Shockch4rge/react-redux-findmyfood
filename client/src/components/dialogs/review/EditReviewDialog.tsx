import {
    Dialog,
    DialogTitle,
    DialogContent,
    Stack,
    Box,
    InputLabel,
    TextField,
    Rating,
    DialogActions,
    Button,
} from "@mui/material";
import { useCallback, useState } from "react";
import { useEditReviewMutation } from "../../../app/services/reviews";
import { setShowEditReviewDialog } from "../../../app/slices/ui/dialogs/reviewDialog";
import { createSnack } from "../../../app/slices/ui/snackbars/snack";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { ReviewData } from "../../../models/Review";
import { timestamp } from "../../../utilities/timestamp";
import { Nullish } from "../../../utilities/Nullable";

interface Props {
    review: ReviewData;
}

const EditReviewDialog = ({ review }: Props) => {
    const dispatch = useAppDispatch();
    const open = useAppSelector(state => state.ui.dialogs.review.edit.show);
    const [editReview] = useEditReviewMutation();

    const titleId = "edit-review-dialog-title";
    const contentId = "edit-review-dialog-content";
    const ratingId = "edit-review-dialog-rating";

    const [title, setTitle] = useState(review.title);
    const [content, setContent] = useState(review.content);
    const [rating, setRating] = useState(review.rating);

    const [isValidTitle, setIsValidTitle] = useState<boolean | null>(null);
    const [isValidContent, setIsValidContent] = useState<boolean | null>(null);

    const handleOnClose = () => {
        setTitle(review.title);
        setContent(review.content);
        setRating(review.rating);
        setIsValidContent(false);
        setIsValidTitle(false);
    };

    const onEditButtonClick = async () => {
        try {
            await editReview({
                id: review.id,
                content,
                title,
                rating,
                timestamp: timestamp(),
                isEdited: true,
            }).unwrap();
            dispatch(setShowEditReviewDialog(false));
            dispatch(
                createSnack({
                    message: "Review edited!",
                    severity: "success",
                })
            );
        } catch (err) {
            console.log(err);
            dispatch(
                createSnack({
                    message: "Error editing review.",
                    severity: "error",
                })
            );
        }
    };

    return (
        <Dialog open={open} onClose={handleOnClose} fullWidth>
            <DialogTitle>Edit your review</DialogTitle>
            <DialogContent>
                <Stack spacing={3}>
                    <Box>
                        <InputLabel htmlFor={titleId}>Title*</InputLabel>
                        <TextField
                            autoFocus
                            id={titleId}
                            name="title"
                            type="text"
                            fullWidth
                            required
                            variant="standard"
                            value={title}
                            onChange={({ target: { value } }) => {
                                setTitle(value);
                                setIsValidTitle(value.length >= 10 && value.length <= 55);
                            }}
                            error={isValidTitle !== null && !isValidTitle}
                            helperText={"10-50 characters"}
                        />
                    </Box>

                    <Box>
                        <InputLabel htmlFor={contentId}>Content*</InputLabel>
                        <TextField
                            multiline
                            rows={5}
                            id={contentId}
                            name="content"
                            fullWidth
                            required
                            value={content}
                            onChange={({ target: { value } }) => {
                                setContent(value);
                                setIsValidContent(value.length >= 20 && value.length <= 250);
                            }}
                            error={isValidContent !== null && !isValidContent}
                            helperText={"20-250 characters"}
                        />
                    </Box>

                    <Box>
                        <InputLabel htmlFor={ratingId}>Rating*</InputLabel>
                        <Rating
                            id={ratingId}
                            precision={0.5}
                            value={+rating}
                            onChange={(_, newRating) => setRating(newRating!)}
                        />
                    </Box>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => dispatch(setShowEditReviewDialog(false))}>Cancel</Button>
                <Button disabled={!isValidTitle || !isValidContent} onClick={onEditButtonClick}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditReviewDialog;
