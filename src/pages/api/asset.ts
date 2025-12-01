import type { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "./../../utils/classes";
import { getClient } from "@/utils/db";
import { Asset } from "@/utils/types";

async function saveAsset(assetDto: any) {
  const res = await fetch(`${API_BASE}/save`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader },
    body: JSON.stringify(assetDto),
  });
  if (!res.ok) throw new ApiError("Asset creation failed", res.status);
  return res.json();
}

async function getAssets(query: any) {
  console.log("Here!");

  const client = await getClient();
  const sql: string =
    "SELECT ID, NAME, DESCRIPTION, SERIAL_NUMBER, CATEGORY_ID, PURCHASE_DATE, COST, DEPARTMENT_ID, USER_ID, DELETED FROM ASSET.ASSET ORDER BY " +
    query.sort +
    " " +
    query.direction;

  try {
    const result = await client.query(sql);
    const assets: Asset[] = result.rows;
    return assets;
  } catch (error) {
    throw new ApiError("Fetching assets failed: " + error, 500);
  } finally {
    await client.end();
  }
}

async function getAssetsByFilter(query: any) {
  const client = await getClient();
  const sql: string =
    "SELECT ID, NAME, DESCRIPTION, SERIAL_NUMBER, CATEGORY_ID, PURCHASE_DATE, COST, DEPARTMENT_ID, USER_ID, DELETED FROM ASSET.ASSET" +
    " WHERE NAME ILIKE '%" +
    query.filter +
    "%' OR DESCRIPTION ILIKE '%" +
    query.filter +
    "%' OR SERIAL_NUMBER ILIKE '%" +
    query.filter +
    "%' OR PURCHASE_DATE ILIKE '%" +
    query.filter +
    "%'";
  " ORDER BY " + query.sort + " " + query.direction;

  try {
    const result = await client.query(sql);
    const assets: Asset[] = result.rows;
    return assets;
  } catch (error) {
    throw new ApiError("Fetching assets failed: " + error, 500);
  } finally {
    await client.end();
  }
}

async function getAssetById(assetId: string) {
  const params = new URLSearchParams({ id: assetId }).toString();
  const res = await fetch(`${API_BASE}/view/get/one?` + params, {
    method: "GET",
    headers: { "Content-Type": "application/json", ...authHeader },
  });
  if (!res.ok) {
    let backendError = "Fetching asset failed";
    try {
      const errorBody = await res.json();
      backendError = errorBody.message || errorBody.error || backendError;
    } catch {}
    throw new ApiError(backendError, res.status);
  }
  return res.json();
}

async function getAssetsByExample(exampleDto: any, query: any) {
  const params = new URLSearchParams();
  if (query.page) params.append("page", query.page);
  if (query.size) params.append("size", query.size);
  if (query.sort) params.append("sortBy", query.sort);
  if (query.direction) params.append("sortDir", query.direction);
  if (query.filter) params.append("filter", query.filter);

  const res = await fetch(
    `${API_BASE}/view/get/all/by/example?${params.toString()}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json", ...authHeader },
      body: JSON.stringify(exampleDto),
    }
  );
  if (!res.ok)
    throw new ApiError("Fetching assets by example failed", res.status);
  return res.json();
}

async function changePassword(passwordDto: any) {
  const res = await fetch(`${API_BASE}/change-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader },
    body: JSON.stringify(passwordDto),
  });
  if (!res.ok) {
    const response = await res.json();
    throw new ApiError(
      response?.message || response?.error || "Password change failed",
      res.status
    );
  }
  return res;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { action, assetId } = req.query;
    const authHeader = getAuthHeader(req);

    if (req.method === "POST") {
      if (action === "save") {
        const data = await saveAsset(req.body, authHeader);
        return res.status(201).json(data);
      }
      if (action === "example") {
        const data = await getAssetsByExample(req.body, authHeader, req.query);
        return res.status(200).json(data);
      }
      if (action === "change-password") {
        const data = await changePassword(req.body, authHeader);
        return res.status(200).json(data);
      }
    }

    if (req.method === "GET") {
      if (action === "all") {
        const data = await getAssets(req.query);
        return res.status(200).json(data);
      }
      if (action === "one" && assetId) {
        const data = await getAssetById(assetId as string, authHeader);
        return res.status(200).json(data);
      }
      if (action === "filtered") {
        const data = await getAssetsByFilter(req.query);
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
