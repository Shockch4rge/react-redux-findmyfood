import users from "../api/users/UserController";
import { RouteSchema } from "../classes/RouteManager";

module.exports = [
    {
        uri: "/user/:id",
        method: "get",
        proc: users.getUser,
    },
    {
        uri: "/user",
        method: "post",
        proc: users.registerUser,
    },
    {
        uri: "/login/:email&:password",
        method: "get",
        proc: users.loginUser,
    },
    {
        uri: "/user/:id",
        method: "put",
        proc: users.updateUser,
    },
    {
        uri: "/user/:id",
        method: "delete",
        proc: users.deleteUser,
    },
    {
        uri: "/reset-password/:email",
        method: "put",
        proc: users.updatePassword
    }
] as RouteSchema[];
