import type { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "./../../utils/classes";
import { getClient } from "@/utils/db";
import { User } from "@/utils/types";

async function login(authDto: {
  username: string;
  password: string;
  rememberMe: boolean;
}) {
  const client = await getClient();
  const sql: string = `
    SELECT
      ID,
      SALUTATION,
      FIRSTNAME,
      OTHERNAMES,
      LASTNAME,
      ROLES,
      EMAIL,
      PHONE,
      USERNAME,
      PASSWORD
    FROM
      ASSET.USER
    WHERE
      USERNAME = $1
    ORDER BY ID DESC`;

  try {
    const result = await client.query(sql, [authDto.username]);
    if (result.rowCount == null || result.rowCount < 1) {
      throw new ApiError("Login failed: User not found", 400);
    }
    if (result.rows[0].password !== authDto.password) {
      throw new ApiError("Login failed: Incorrect password", 400);
    }
    const user: User = result.rows[0];
    user.loggedIn = true;
    return { user: user };
  } catch (error) {
    throw new ApiError("Login failed: " + error, 500);
  } finally {
    await client.end();
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { action } = req.query;

    if (req.method === "POST") {
      if (action === "login") {
        const data = await login(req.body);
        return res.status(200).json(data);
      }
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err: any) {
    if (err.statusCode) {
      return res
        .status(err.statusCode)
        .json({ error: err.message || "Internal server error" });
    }
    return res
      .status(500)
      .json({ error: err.message || "Internal server error" });
  }
}
