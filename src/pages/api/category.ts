import type { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "../../utils/classes";
import { getClient } from "@/utils/db";
import { Department } from "@/utils/types";

async function saveDepartment(categoryDto: any) {
  const client = getClient();

  try {
    if (categoryDto.id) {
      const { error } = await client
        .from("category")
        .update({ name: categoryDto.name })
        .eq("id", categoryDto.id);
      if (error) throw error;
    } else {
      const { error } = await client
        .from("category")
        .insert([{ name: categoryDto.name }]);
      if (error) throw error;
    }
    return { success: true };
  } catch (error: any) {
    throw new ApiError("Saving category failed: " + error.message, 500);
  }
}

async function getDepartments(query: any) {
  const client = getClient();

  try {
    const { data, error } = await client
      .from("category")
      .select("id, name")
      .order(query.sort || "id", { ascending: query.direction === "ASC" });

    if (error) throw error;
    return data || [];
  } catch (error: any) {
    throw new ApiError("Fetching categorys failed: " + error.message, 500);
  }
}

async function getDepartmentsByFilter(query: any) {
  const client = getClient();

  try {
    const { data, error } = await client
      .from("category")
      .select("id, name")
      .ilike("name", `%${query.filter}%`)
      .order(query.sort || "id", { ascending: query.direction === "ASC" });

    if (error) throw error;
    return data || [];
  } catch (error: any) {
    throw new ApiError("Fetching categorys failed: " + error.message, 500);
  }
}

async function getDepartmentById(categoryId: string) {
  const client = getClient();

  try {
    const { data, error } = await client
      .from("category")
      .select("id, name")
      .eq("id", categoryId)
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    throw new ApiError("Fetching categorys failed: " + error.message, 500);
  }
}

async function getDepartmentsByExample(exampleDto: Department, query: any) {
  const client = getClient();

  try {
    let q = client.from("category").select("id, name");

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
    throw new ApiError("Fetching categorys failed: " + error.message, 500);
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { action, categoryId } = req.query;

    if (req.method === "POST") {
      if (action === "save") {
        const data = await saveDepartment(req.body);
        return res.status(201).json(data);
      }
      if (action === "example") {
        const data = await getDepartmentsByExample(req.body, req.query);
        return res.status(200).json(data);
      }
    }

    if (req.method === "GET") {
      if (action === "all") {
        const data = await getDepartments(req.query);
        return res.status(200).json(data);
      }
      if (action === "one" && categoryId) {
        const data = await getDepartmentById(categoryId as string);
        return res.status(200).json(data);
      }
      if (action === "filtered") {
        const data = await getDepartmentsByFilter(req.query);
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
