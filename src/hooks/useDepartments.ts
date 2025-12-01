import useSWR from "swr";
import { useSelector } from "react-redux";
import { ApiError, Page } from "../utils/classes";
import { RootState } from "./../store/store"; // Adjust path if needed
import { Department } from "@/utils/types";

const fetcherWithAuth = (url: string) =>
  fetch(url).then(async (res) => {
    if (!res.ok) {
      throw new ApiError(
        "Fetch failed: " + (await res.json()).error,
        res.status
      );
    }
    return res.json();
  });

export function useDepartmentsAll({
  sort,
  direction,
}: {
  sort?: string;
  direction?: "ASC" | "DESC";
}) {
  const user: any = useSelector((state: RootState) => state.auth.user);
  const shouldFetch = user && user.loggedIn;
  const params = new URLSearchParams({
    sort: sort ? `${sort}` : "",
    direction: direction || "DESC",
  });
  const { data, error, mutate } = useSWR(
    shouldFetch ? [`/api/department?action=all&${params.toString()}`] : null,
    ([url]) => fetcherWithAuth(url)
  );
  return {
    departments: data as Department[],
    isLoading: shouldFetch && !error && !data,
    isError: error,
    mutate,
  };
}

export function useDepartmentsAllByFilter({
  sort,
  direction,
  filter,
}: {
  sort?: string;
  direction?: "ASC" | "DESC";
  filter?: string;
}) {
  const user: any = useSelector((state: RootState) => state.auth.user);
  const shouldFetch = department && department.loggedIn;
  const params = new URLSearchParams({
    sort: sort ? `${sort}` : "",
    direction: direction || "DESC",
    filter: filter || "",
  });
  const { data, error, mutate } = useSWR(
    shouldFetch ? [`/api/department?action=filtered&${params.toString()}`] : null,
    ([url]) => fetcherWithAuth(url)
  );
  return {
    departments: data as Department[],
    isLoading: shouldFetch && !error && !data,
    isError: error,
    mutate,
  };
}

export function useDepartmentById(departmentId: string | undefined) {
  const user: any = useSelector((state: RootState) => state.auth.user);
  const shouldFetch = !!departmentId && user && user.loggedIn;
  const { data, error, mutate } = useSWR(
    shouldFetch ? [`/api/department?action=one&departmentId=${departmentId}`] : null,
    ([url]) => fetcherWithAuth(url)
  );

  let errorMessage: string | undefined = undefined;
  let statusCode: number | undefined = undefined;
  if (error instanceof ApiError) {
    errorMessage = error.message;
    statusCode = error.statusCode;
  } else if (error && error.message) {
    errorMessage = error.message;
  }

  return {
    department: data as Department,
    isLoading: shouldFetch && !error && !data,
    isError: !!error,
    errorMessage,
    statusCode,
    mutate,
  };
}

export function useDepartmentsByExample(exampleDto: any) {
  const token = useSelector((state: RootState) => state.auth.token);
  const key =
    exampleDto && token
      ? [`/api/department?action=example`, exampleDto, token]
      : null;
  const fetcherWithBody = async ([url, body, token]: [string, any, string]) => {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      throw new ApiError(
        "Fetch failed: " + (await res.json()).error,
        res.status
      );
    }
    return res.json();
  };
  const { data, error, mutate } = useSWR(key, fetcherWithBody);
  return {
    departments: data as Page<DepartmentView>,
    isLoading: !!exampleDto && !!token && !error && !data,
    isError: error,
    mutate,
  };
}

export function useSaveDepartment() {
  const principal = useSelector((state: RootState) => state.auth.user);

  const saveDepartment = async (
    department: Department,
    incrementLoading: () => void,
    decrementLoading: () => void,
    onSuccess?: () => void,
    onError?: (error: string, statusCode: number) => void
  ) => {
    incrementLoading();

    let result = null;
    try {
      const res = await fetch("/api/department?action=save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(department),
      });

      const data = await res.json();

      if (!res.ok) {
        const err = data.error || "Updating department failed";
        const code = res.status || 500;
        onError?.(err, code);
        result = { success: false, error: err, statusCode: code };
      } else {
        onSuccess?.();
        result = { success: true };
      }
      decrementLoading();
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Network/Server error";
      const statusCode = err.status || 500;
      onError?.(errorMessage, statusCode);
      result = { success: false, error: errorMessage, statusCode };
      decrementLoading();
    } finally {
      decrementLoading();
    }

    return result;
  };

  return { saveDepartment };
}
