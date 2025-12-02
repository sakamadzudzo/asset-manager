import type { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "./../../utils/classes";
import { getClient } from "@/utils/db";
import { Asset } from "@/utils/types";

const baseSelectSql = `
SELECT
  A.ID,
  A.NAME,
  A.DESCRIPTION,
  A.SERIAL_NUMBER,
  A.CATEGORY_ID,
  C.NAME CATEGORY,
  A.PURCHASE_DATE,
  A.COST,
  A.DEPARTMENT_ID,
  D.NAME DEPARTMENT,
  A.USER_ID,
  CASE
    WHEN U.SALUTATION <> '' THEN U.SALUTATION || '. '
    ELSE ''
  END ||
  CASE
    WHEN U.FIRSTNAME <> '' THEN U.FIRSTNAME || ' '
    ELSE ''
  END ||
  CASE
    WHEN U.OTHERNAMES <> '' THEN U.OTHERNAMES || ' '
    ELSE ''
  END ||
  CASE
    WHEN U.LASTNAME <> '' THEN U.LASTNAME || ' '
    ELSE ''
  END USER,
  A.DELETED
FROM
  ASSET.ASSET A
LEFT JOIN
  ASSET.CATEGORY C
ON
  A.CATEGORY_ID = C.ID
LEFT JOIN
  ASSET.DEPARTMENT D
ON
  A.DEPARTMENT_ID = D.ID
LEFT JOIN
  ASSET.USER U
ON
  A.USER_ID = U.ID
`;

async function saveAsset(assetDto: any) {
  const client = await getClient();
  const sqlNew: string = `
  INSERT INTO
    ASSET.ASSET
      (
        NAME,
        DESCRIPTION,
        SERIAL_NUMBER,
        CATEGORY_ID,
        PURCHASE_DATE,
        COST,
        DEPARTMENT_ID,
        USER_ID,
        DELETED
      )
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;

  const sqlEdit: string = `
  UPDATE
    ASSET.ASSET
  SET
    NAME=$1,
    DESCRIPTION=$2,
    SERIAL_NUMBER=$3,
    CATEGORY_ID=$4,
    PURCHASE_DATE=$5,
    COST=$6,
    DEPARTMENT_ID=$7,
    USER_ID=$8,
    DELETED=$9
  WHERE
    ID = $10`;

  let params: any[] = [
    assetDto.name,
    assetDto.description,
    assetDto.serial_number,
    assetDto.category_id,
    assetDto.purchase_date,
    assetDto.cost,
    assetDto.department_id,
    assetDto.user_id,
    assetDto.deleted || false,
  ];
  if (!!assetDto.id) {
    params.push(assetDto.id);
  }

  try {
    const result = await client.query(!!assetDto.id ? sqlEdit : sqlNew, params);
    return result;
  } catch (error) {
    throw new ApiError("Saving asset failed: " + error, 500);
  } finally {
    await client.end();
  }
}

async function getAssets(query: any) {
  const client = await getClient();
  const sql: string = `${baseSelectSql}
  ORDER BY
    ${query.sort} ${query.direction}`;

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
  const sql: string = `${baseSelectSql}
  WHERE
    A.NAME ILIKE $1
    OR A.DESCRIPTION ILIKE $1
    OR A.SERIAL_NUMBER ILIKE $1
    OR A.PURCHASE_DATE ILIKE $1
    OR D.NAME ILIKE $1
    OR U.FIRSTNAME ILIKE $1
    OR U.OTHERNAMES ILIKE $1
    OR U.LASTNAME ILIKE $1
    OR C.NAME ILIKE $1
  ORDER BY
    ${query.sort} ${query.direction}`;

  try {
    const result = await client.query(sql, [query.filter]);
    const assets: Asset[] = result.rows;
    return assets;
  } catch (error) {
    throw new ApiError("Fetching assets failed: " + error, 500);
  } finally {
    await client.end();
  }
}

async function getAssetById(assetId: string) {
  const client = await getClient();
  const sql: string = `${baseSelectSql}
  WHERE
    A.ID = $1`;

  try {
    const result = await client.query(sql, [assetId]);
    const asset: Asset = result.rows[0];
    return asset;
  } catch (error) {
    throw new ApiError("Fetching asset failed: " + error, 500);
  } finally {
    await client.end();
  }
}

async function getAssetsByExample(exampleDto: Asset, query: any) {
  const client = await getClient();
  const whereClauses: string[] = [];
  const params: any[] = [];
  let paramIndex = 1;

  if (exampleDto) {
    Object.entries(exampleDto).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        whereClauses.push(`A.${key} = $${paramIndex}`);
        params.push(value);
        paramIndex++;
      }
    });
  }

  const whereSql =
    whereClauses.length > 0 ? ` WHERE ${whereClauses.join(" AND ")}` : "";

  const orderSql = query?.sort
    ? ` ORDER BY ${query.sort} ${query.direction ?? "ASC"}`
    : "";

  const sql = `${baseSelectSql} ${whereSql} ${orderSql}`;

  try {
    const result = await client.query(sql, params);
    const assets: Asset[] = result.rows;
    return assets;
  } catch (error) {
    throw new ApiError("Fetching assets failed: " + error, 500);
  } finally {
    await client.end();
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
        const data = await getAssetsByExample(req.body, req.query);
        return res.status(200).json(data);
      }
    }

    if (req.method === "GET") {
      if (action === "all") {
        const data = await getAssets(req.query);
        return res.status(200).json(data);
      }
      if (action === "one" && assetId) {
        const data = await getAssetById(assetId as string);
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
