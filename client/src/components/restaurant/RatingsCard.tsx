import { Box, Typography, Card, CardContent, Rating, Button } from "@mui/material";
import { setShowWriteReviewDialog } from "../../app/slices/dialogs";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { RestaurantData } from "../../models/Restaurant";
import { ReviewData } from "../../models/Review";
import WriteReviewDialog from "../dialogs/WriteReviewDialog";

interface Props {
    restaurant: RestaurantData;
    reviews: ReviewData[];
    hasUserReviewed: boolean
}

const RatingsCard = ({ restaurant, reviews, hasUserReviewed }: Props) => {
    const dispatch = useAppDispatch();

    return (
        <Box>
            <Typography mb={1} variant="h5">
                RATING
            </Typography>
            <Card
                sx={{
                    minWidth: 300,
                    width: "fit-content",
                    height: 300,
                    borderRadius: 5,
                    boxShadow: 3,
                    p: 1,
                }}
            >
                <CardContent>
                    <Typography variant="h2">{restaurant.averageRating}</Typography>
                    <Box sx={{ display: "flex" }}>
                        <Rating readOnly value={restaurant.averageRating} precision={0.5} />
                        <Typography ml={1} fontSize={16}>
                            ({reviews.length} reviews)
                        </Typography>
                    </Box>
                    {!hasUserReviewed && (
                        <Box display="flex" justifyContent="space-around" alignItems="center">
                            <Button
                                variant="contained"
                                sx={{ borderRadius: 10, mt: 17, width: 260 }}
                                onClick={() => dispatch(setShowWriteReviewDialog(true))}
                            >
                                Write a review
                            </Button>
                        </Box>
                    )}
                </CardContent>
            </Card>

            <WriteReviewDialog />
        </Box>
    );
};

export default RatingsCard;