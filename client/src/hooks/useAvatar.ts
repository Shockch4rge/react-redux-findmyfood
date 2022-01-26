import { useGetUserAvatarQuery } from "../app/services/images";
import config from "../config.json";

const useAvatar = (userId: string) => {
    const { data: avatarPath } = useGetUserAvatarQuery(userId);
    return `${config.api.baseUrl}/uploads/${avatarPath}`;
};
