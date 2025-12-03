import type { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "./../../utils/classes";
import { getClient } from "@/utils/db";
import { Asset } from "@/utils/types";

const getCookie = (req: NextApiRequest, name: string) => {
  const cookies = req.headers.cookie?.split(";") || [];
  const cookie = cookies.find((c) => c.trim().startsWith(`${name}=`));
  return cookie ? cookie.split("=")[1] : null;
};

const isUserRestricted = (req: NextApiRequest) => {
  const isAdmin = getCookie(req, "isAdmin") === "true";
  const userId = getCookie(req, "userId");
  return !isAdmin && userId ? userId : null;
};

async function saveAsset(assetDto: any) {
  const client = getClient();
  const data = {
    name: assetDto.name,
    description: assetDto.description,
    serial_number: assetDto.serial_number,
    category_id: assetDto.category_id,
    purchase_date: assetDto.purchase_date,
    cost: assetDto.cost,
    department_id: assetDto.department_id,
    user_id: assetDto.user_id,
    deleted: assetDto.deleted || false,
  };

  try {
    if (assetDto.id) {
      const { error } = await client
        .from("asset")
        .update(data)
        .eq("id", assetDto.id);
      if (error) throw error;
    } else {
      const { error } = await client.from("asset").insert([data]);
      if (error) throw error;
    }
    return { success: true };
  } catch (error: any) {
    throw new ApiError("Saving asset failed: " + error.message, 500);
  }
}

async function getAssets(query: any, req: NextApiRequest) {
  const supabase = getClient();
  const userId = isUserRestricted(req);

  try {
    let client = supabase.from("asset").select(
      `id, name, description, serial_number, category_id, purchase_date, cost, department_id, user_id, deleted,
        category(name), department(name), user(salutation, firstname, othernames, lastname)`
    );

    if (userId) {
      client = client.eq("user_id", userId);
    }

    const { data, error } = await client.order(query.sort || "id", {
      ascending: query.direction === "ASC",
    });

    if (error) throw error;
    return data || [];
  } catch (error: any) {
    throw new ApiError("Fetching assets failed: " + error.message, 500);
  }
}

async function getAssetsByFilter(query: any, req: NextApiRequest) {
  const supabase = getClient();
  const userId = isUserRestricted(req);

  try {
    let client = supabase
      .from("asset")
      .select(
        `id, name, description, serial_number, category_id, purchase_date, cost, department_id, user_id, deleted,
        category(name), department(name), user(salutation, firstname, othernames, lastname)`
      )
      .or(
        `name.ilike.%${query.filter}%,description.ilike.%${query.filter}%,serial_number.ilike.%${query.filter}%`
      );

    if (userId) {
      client = client.eq("user_id", userId);
    }

    const { data, error } = await client.order(query.sort || "id", {
      ascending: query.direction === "ASC",
    });

    if (error) throw error;
    return data || [];
  } catch (error: any) {
    throw new ApiError("Fetching assets failed: " + error.message, 500);
  }
}

async function getAssetById(assetId: string, req: NextApiRequest) {
  const supabase = getClient();
  const userId = isUserRestricted(req);

  try {
    let client = supabase
      .from("asset")
      .select(
        `id, name, description, serial_number, category_id, purchase_date, cost, department_id, user_id, deleted,
        category(name), department(name), user(salutation, firstname, othernames, lastname)`
      )
      .eq("id", assetId);

    if (userId) {
      client = client.eq("user_id", userId);
    }

    const { data, error } = await client.single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    throw new ApiError("Fetching asset failed: " + error.message, 500);
  }
}

async function getAssetsByExample(
  exampleDto: Asset,
  query: any,
  req: NextApiRequest
) {
  const supabase = getClient();
  const userId = isUserRestricted(req);

  try {
    let client = supabase.from("asset").select(
      `id, name, description, serial_number, category_id, purchase_date, cost, department_id, user_id, deleted,
        category(name), department(name), user(salutation, firstname, othernames, lastname)`
    );

    if (exampleDto) {
      Object.entries(exampleDto).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          client = client.eq(key, value);
        }
      });
    }

    if (userId) {
      client = client.eq("user_id", userId);
    }

    const { data, error } = await client.order(query.sort || "id", {
      ascending: query.direction === "ASC",
    });

    if (error) throw error;
    return data || [];
  } catch (error: any) {
    throw new ApiError("Fetching assets failed: " + error.message, 500);
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { action, assetId } = req.query;

    if (req.method === "POST") {
      if (action === "save") {
        const data = await saveAsset(req.body);
        return res.status(201).json(data);
      }
      if (action === "example") {
        const data = await getAssetsByExample(req.body, req.query, req);
        return res.status(200).json(data);
      }
    }

    if (req.method === "GET") {
      if (action === "all") {
        const data = await getAssets(req.query, req);
        return res.status(200).json(data);
      }
      if (action === "one" && assetId) {
        const data = await getAssetById(assetId as string, req);
        return res.status(200).json(data);
      }
      if (action === "filtered") {
        const data = await getAssetsByFilter(req.query, req);
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
