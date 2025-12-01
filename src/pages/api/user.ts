import type { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "./../../utils/classes";
import { getClient } from "@/utils/db";
import { User } from "@/utils/types";

async function saveUser(userDto: any) {
  const client = await getClient();
  const sqlNew: string = `
  INSERT INTO
    ASSET.USER
      (
        FIRSTNAME,
        OTHERNAMES,
        LASTNAME,
        SALUTATION,
        ROLES,
        EMAIL,
        PHONE,
        USERNAME,
        PASSWORD,
        DEPARTMENT_ID
      ) 
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;

  const sqlEdit: string = `
  UPDATE
    ASSET.USER
  SET
    FIRSTNAME=$1,
    OTHERNAMES=$2,
    LASTNAME=$3,
    SALUTATION=$4,
    ROLES=$5,
    EMAIL=$6,
    PHONE=$7,
    USERNAME=$8,
    PASSWORD=$9,
    DEPARTMENT_ID=$10
  WHERE
    ID = $11`;

  let params: any[] = [
    userDto.firstname,
    userDto.othernames,
    userDto.lastname,
    userDto.salutation,
    userDto.rolesString,
    userDto.email,
    userDto.phone,
    userDto.username,
    userDto.password,
    userDto.department_id,
  ];
  if (!!userDto.id) {
    params.push(userDto.id);
  }

  try {
    const result = await client.query(!!userDto.id ? sqlEdit : sqlNew, params);
    return result;
  } catch (error) {
    throw new ApiError("Saving user failed: " + error, 500);
  } finally {
    await client.end();
  }
}

async function getUsers(query: any) {
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
  ORDER BY
    ${query.sort} ${query.direction}`;

  try {
    const result = await client.query(sql);
    const users: User[] = result.rows;
    return users;
  } catch (error) {
    throw new ApiError("Fetching users failed: " + error, 500);
  } finally {
    await client.end();
  }
}

async function getUsersByFilter(query: any) {
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
    FIRSTNAME ILIKE $1
    OR OTHERNAMES ILIKE $1
    OR LASTNAME ILIKE $1
    OR EMAIL ILIKE $1
    OR PHONE ILIKE $1
    OR USERNAME ILIKE $1
  ORDER BY
    ${query.sort} ${query.direction}`;

  try {
    const result = await client.query(sql, [query.filter]);
    const users: User[] = result.rows;
    return users;
  } catch (error) {
    throw new ApiError("Fetching users failed: " + error, 500);
  } finally {
    await client.end();
  }
}

async function getUserById(userId: string) {
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
      ID = $1`;

  try {
    const result = await client.query(sql, [userId]);
    const user: User = result.rows[0];
    return user;
  } catch (error) {
    throw new ApiError("Fetching users failed: " + error, 500);
  } finally {
    await client.end();
  }
}

async function getUsersByExample(exampleDto: User, query: any) {
  const client = await getClient();
  const baseSql: string = `
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
    const users: User[] = result.rows;
    return users;
  } catch (error) {
    throw new ApiError("Fetching users failed: " + error, 500);
  } finally {
    await client.end();
  }
}

async function changePassword(passwordDto: any) {
  const client = await getClient();
  const sqlEdit: string = `
  UPDATE
    ASSET.USER
  SET
    PASSWORD=$1
  WHERE
    ID = $2`;

  try {
    const result = await client.query(sqlEdit, [
      passwordDto.password,
      passwordDto.id,
    ]);
    return result;
  } catch (error) {
    throw new ApiError("Changing password failed: " + error, 500);
  } finally {
    await client.end();
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
