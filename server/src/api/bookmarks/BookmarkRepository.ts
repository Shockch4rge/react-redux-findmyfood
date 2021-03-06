import db from "../../db";
import { RowDataPacket } from "mysql2";
import { BookmarkData } from "./Bookmark";
import { uuid } from "../../utilities/uuid";

export default class BookmarkRepository {
    public static async getUserBookmarks(userId: string) {
        const query = `SELECT * FROM bookmark WHERE user_id = ?`;
        const results = await db.query(query, [userId]);
        return results[0] as RowDataPacket[];
    }

    public static async get(id: string) {
        const query = `SELECT * FROM bookmark WHERE id = ?`;
        const results = await db.query(query, [id]);
        return (results[0] as RowDataPacket[])[0];
    }

    public static async add(data: BookmarkData) {
        const values = Object.values(data);
        const id = uuid()
        const query = `INSERT INTO bookmark VALUES (?, ?, ?)`;
        await db.query(query, [id, ...values]);
    }

    public static async delete(id: string) {
        const query = `DELETE FROM bookmark WHERE id = ?`;
        await db.query(query, [id]);
    }
}
