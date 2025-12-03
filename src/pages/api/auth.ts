import type { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "./../../utils/classes";
import { getClient } from "@/utils/db";
import { User } from "@/utils/types";

async function login(authDto: {
  username: string;
  password: string;
  rememberMe: boolean;
}) {
  const client = getClient();

  try {
    const { data, error } = await client
      .from("user")
      .select("id, salutation, firstname, othernames, lastname, roles, email, phone, username, password, department_id")
      .eq("username", authDto.username)
      .single();

    if (error || !data) {
      throw new ApiError("Login failed: User not found", 400);
    }
    if (data.password !== authDto.password) {
      throw new ApiError("Login failed: Incorrect password", 400);
    }
    const user: User = data;
    user.loggedIn = true;
    return { user: user };
  } catch (error: any) {
    if (error instanceof ApiError) throw error;
    throw new ApiError("Login failed: " + error.message, 500);
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
