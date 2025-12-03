import type { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "./../../utils/classes";
import { getClient } from "@/utils/db";
import { User } from "@/utils/types";

async function saveUser(userDto: any) {
  const client = getClient();
  const data = {
    firstname: userDto.firstname,
    othernames: userDto.othernames,
    lastname: userDto.lastname,
    salutation: userDto.salutation,
    roles: userDto.rolesString,
    email: userDto.email,
    phone: userDto.phone,
    username: userDto.username,
    password: userDto.password,
    department_id: userDto.department_id,
  };

  try {
    if (userDto.id) {
      const { error } = await client.from("user").update(data).eq("id", userDto.id);
      if (error) throw error;
    } else {
      const { error } = await client.from("user").insert([data]);
      if (error) throw error;
    }
    return { success: true };
  } catch (error: any) {
    throw new ApiError("Saving user failed: " + error.message, 500);
  }
}

async function getUsers(query: any) {
  const client = getClient();

  try {
    const { data, error } = await client
      .from("user")
      .select(
        `id, salutation, firstname, othernames, lastname, roles, email, phone, username, password, department_id,
        department(name)`
      )
      .order(query.sort || "id", { ascending: query.direction === "ASC" });

    if (error) throw error;
    return data || [];
  } catch (error: any) {
    throw new ApiError("Fetching users failed: " + error.message, 500);
  }
}

async function getUsersByFilter(query: any) {
  const client = getClient();

  try {
    const { data, error } = await client
      .from("user")
      .select(
        `id, salutation, firstname, othernames, lastname, roles, email, phone, username, password, department_id,
        department(name)`
      )
      .or(
        `firstname.ilike.%${query.filter}%,othernames.ilike.%${query.filter}%,lastname.ilike.%${query.filter}%,email.ilike.%${query.filter}%,phone.ilike.%${query.filter}%,username.ilike.%${query.filter}%`
      )
      .order(query.sort || "id", { ascending: query.direction === "ASC" });

    if (error) throw error;
    return data || [];
  } catch (error: any) {
    throw new ApiError("Fetching users failed: " + error.message, 500);
  }
}

async function getUserById(userId: string) {
  const client = getClient();

  try {
    const { data, error } = await client
      .from("user")
      .select(
        `id, salutation, firstname, othernames, lastname, roles, email, phone, username, password, department_id,
        department(name)`
      )
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    throw new ApiError("Fetching users failed: " + error.message, 500);
  }
}

async function getUsersByExample(exampleDto: User, query: any) {
  const client = getClient();

  try {
    let q = client
      .from("user")
      .select(
        `id, salutation, firstname, othernames, lastname, roles, email, phone, username, password, department_id,
        department(name)`
      );

    if (exampleDto) {
      Object.entries(exampleDto).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          q = q.eq(key, value);
        }
      });
    }

    const { data, error } = await q.order(query.sort || "id", {
      ascending: query.direction === "ASC",
    });

    if (error) throw error;
    return data || [];
  } catch (error: any) {
    throw new ApiError("Fetching users failed: " + error.message, 500);
  }
}

async function changePassword(passwordDto: any) {
  const client = getClient();

  try {
    const { error } = await client
      .from("user")
      .update({ password: passwordDto.password })
      .eq("id", passwordDto.id);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    throw new ApiError("Changing password failed: " + error.message, 500);
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { action, userId } = req.query;

    if (req.method === "POST") {
      if (action === "save") {
        const data = await saveUser(req.body);
        return res.status(201).json(data);
      }
      if (action === "example") {
        const data = await getUsersByExample(req.body, req.query);
        return res.status(200).json(data);
      }
      if (action === "change-password") {
        const data = await changePassword(req.body);
        return res.status(200).json(data);
      }
    }

    if (req.method === "GET") {
      if (action === "all") {
        const data = await getUsers(req.query);
        return res.status(200).json(data);
      }
      if (action === "one" && userId) {
        const data = await getUserById(userId as string);
        return res.status(200).json(data);
      }
      if (action === "filtered") {
        const data = await getUsersByFilter(req.query);
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
