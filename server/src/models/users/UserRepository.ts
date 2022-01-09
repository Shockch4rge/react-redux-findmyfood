import { UserData } from "./User";
import db from "../../db";
import { RowDataPacket } from "mysql2";
import { BookmarkData } from "../bookmarks/Bookmark";
import { uuid } from "../../utilities/uuid";
import bcrypt from "bcrypt";

export default class UserRepository {
    public static async update(id: string, data: UserData) {
        const query = `UPDATE user SET first_name = ?, last_name, `;
    }

    public static async delete(id: string) {
        const query = `DELETE FROM user WHERE id = ?`;
        await db.query(query, [id]);
    }

    public static async get(id: string) {
        const query = "SELECT * FROM user WHERE id = ?";

        const results = await db.query(query, [id]);
        return (results[0] as RowDataPacket[])[0];
    }

    public static async login(email: string, password: string) {
        let query = `SELECT password FROM account WHERE email = ?`;
        // try to fetch the password
        const possiblePassword = (await db.query(query, [email]))[0] as RowDataPacket[];

        // if no password received, user entered the wrong email
        if (possiblePassword.length <= 0) {
            throw new Error("Email was incorrect!");
        }

        const _password = possiblePassword[0]["password"];

        // compare the entered password and the actual one
        const verified = await bcrypt.compare(password, _password);

        if (!verified) {
            throw new Error("Password was incorrect!");
        }

        query = `
        SELECT 
            u.*,
            a.email,
            a.password,
            a.address,
            a.telephone,
            a.activated,
            ua.avatar_path
        FROM user u
        JOIN account a
            ON a.user_id = u.id
        JOIN user_avatar ua
            ON ua.user_id = u.id
        WHERE a.email = ? AND a.password = ?
        `;

        const results = await db.query(query, [email, _password]);
        return (results[0] as RowDataPacket[])[0];
    }

    public static async register(user: Omit<UserData, "id">) {
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(user.password, salt);
        user.password = hash;
        const userDetails = Object.values(user);
        const accountDetails = Object.values(user);
        const id = uuid();

        try {
            await db.query(`START TRANSACTION`);
            await db.query(`INSERT INTO user VALUES (?, ?, ?, ?, ?)`, [id, ...userDetails]);
            await db.query(`INSERT INTO account VALUES (?, ?, ?, ?, ?, ?)`, [
                id,
                ...accountDetails,
            ]);
            await db.query(`COMMIT`);
        } catch (err) {
            console.error(err);
        }
    }

    public static async getAllUserBookmarks(userId: string) {
        const query = `SELECT * FROM bookmark WHERE user_id = ?`;
        const results = await db.query(query, [userId]);
        return results[0] as RowDataPacket[];
    }

    public static async getUserBookmark(userId: string, bookmarkId: string) {
        const query = `SELECT * FROM bookmark WHERE user_id = ? AND id = ?`;
        const results = await db.query(query, [userId, bookmarkId]);
        return (results[0] as RowDataPacket[])[0];
    }

    public static async addBookmark(data: BookmarkData) {
        const values = Object.values(data);
        const query = `INSERT INTO bookmark VALUES (?, ?, ?)`;
        await db.query(query, [...values]);
    }

    public static async deleteBookmark(id: string) {
        const query = `DELETE FROM bookmark WHERE id = ?`;
        await db.query(query, [id]);
    }
}
