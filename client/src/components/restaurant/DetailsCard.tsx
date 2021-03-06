import { Box, Typography, Card, CardContent } from "@mui/material";
import { RestaurantData } from "../../models/Restaurant";

interface Props {
    restaurant: RestaurantData;
}

const DetailsCard = ({ restaurant }: Props) => {
    return (
        <Box>
            <Typography mb={1} variant="h5">
                DETAILS
            </Typography>
            <Card
                sx={{
                    width: 300,
                    height: 300,
                    borderRadius: 5,
                    boxShadow: 3,
                    p: 1,
                }}
            >
                <CardContent>
                    <Typography>Cuisines:</Typography>
                    <Typography fontFamily="GalyonBook">
                        {restaurant.cuisines.join(", ")}
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
};

export default DetailsCard;
