export enum Status {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
  DELETED = "DELETED",
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  BLOCKED = "BLOCKED",
  UNBLOCKED = "UNBLOCKED",
  ENABLED = "ENABLED",
  DISABLED = "DISABLED",
}

export enum Salutation {
  MR = "MR",
  MRS = "MRS",
  MS = "MS",
  DR = "DR",
  PROF = "PROF",
  ENG = "ENG",
  REV = "REV",
  SNR = "SNR",
  JNR = "JNR",
}

export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
}

export type DashboardProps = {
  title: string;
  statistics: Statistic[];
  infos?: DashboardInfo[];
};

export type Statistic = {
  statistic: number;
  detail: string;
  colors?: string;
};

export type DashboardInfo = {
  title: string;
  info: string[];
};

export type User = {
  id: number;
  salutation: Salutation;
  firstname: string;
  othernames?: string;
  lastname: string;
  email: string;
  username: string;
  roles: Role[];
  phone: string;
  department_id: number;
  loggedIn: boolean;
};

export type Asset = {
  id: number;
  name: string;
  description: string;
  serial_number: string;
  category_id: string;
  purchase_date: Date;
  cost: number;
  department_id: number;
  user_id: number;
  deleted: boolean;
};

export type Category = {
  id: number;
  name: string;
};

export type Department = {
  id: number;
  name: string;
};

export interface IUser extends User {
  password: string;
  rolesString: string;
}

export type Errors<T, V> = {
  [K in keyof T]: T[K] extends object ? Errors<T[K], V> : V;
} & {
  general?: string;
};
