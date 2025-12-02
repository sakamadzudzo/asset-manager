import type { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "./../../utils/classes";
import { getClient } from "@/utils/db";
import { Department } from "@/utils/types";

async function saveDepartment(departmentDto: any) {
  const client = await getClient();
  const sqlNew: string = `
  INSERT INTO
    ASSET.DEPARTMENT
      (
        NAME
      ) 
  VALUES ($1)`;

  const sqlEdit: string = `
  UPDATE
    ASSET.DEPARTMENT
  SET
    NAME=$1
  WHERE
    ID = $2`;

  let params: any[] = [departmentDto.name];
  if (!!departmentDto.id) {
    params.push(departmentDto.id);
  }

  try {
    const result = await client.query(
      !!departmentDto.id ? sqlEdit : sqlNew,
      params
    );
    return result;
  } catch (error) {
    throw new ApiError("Saving department failed: " + error, 500);
  } finally {
    await client.end();
  }
}

async function getDepartments(query: any) {
  const client = await getClient();
  const sql: string = `
  SELECT
    ID,
    NAME
  FROM
    ASSET.DEPARTMENT
  ORDER BY
    ${query.sort || "ID"} ${query.direction || "DESC"}`;

  try {
    const result = await client.query(sql);
    const departments: Department[] = result.rows;
    return departments;
  } catch (error) {
    throw new ApiError("Fetching departments failed: " + error, 500);
  } finally {
    await client.end();
  }
}

async function getDepartmentsByFilter(query: any) {
  const client = await getClient();
  const sql: string = `
  SELECT
    ID,
    NAME
  FROM
    ASSET.DEPARTMENT
  WHERE 
    NAME ILIKE $1
  ORDER BY
    ${query.sort} ${query.direction}`;

  try {
    const result = await client.query(sql, [query.filter]);
    const departments: Department[] = result.rows;
    return departments;
  } catch (error) {
    throw new ApiError("Fetching departments failed: " + error, 500);
  } finally {
    await client.end();
  }
}

async function getDepartmentById(departmentId: string) {
  const client = await getClient();
  const sql: string = `
  SELECT
      ID,
      NAME
    FROM
      ASSET.DEPARTMENT
    WHERE
      ID = $1`;

  try {
    const result = await client.query(sql, [departmentId]);
    const department: Department = result.rows[0];
    return department;
  } catch (error) {
    throw new ApiError("Fetching departments failed: " + error, 500);
  } finally {
    await client.end();
  }
}

async function getDepartmentsByExample(exampleDto: Department, query: any) {
  const client = await getClient();
  const baseSql: string = `
  SELECT
    ID,
    NAME
  FROM
    ASSET.DEPARTMENT
  `;
  const whereClauses: string[] = [];
  const params: any[] = [];
  let paramIndex = 1;

  if (exampleDto) {
    Object.entries(exampleDto).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        whereClauses.push(`${key} = $${paramIndex}`);
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

  const sql = `${baseSql} ${whereSql} ${orderSql}`;

  try {
    const result = await client.query(sql, params);
    const departments: Department[] = result.rows;
    return departments;
  } catch (error) {
    throw new ApiError("Fetching departments failed: " + error, 500);
  } finally {
    await client.end();
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { action, departmentId } = req.query;

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
      if (action === "one" && departmentId) {
        const data = await getDepartmentById(departmentId as string);
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
