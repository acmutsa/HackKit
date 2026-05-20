import type { InferInsert, InferSelect } from "./database";
import type { coreModels } from "./models";

export type AuthId = string;
export type UserId = AuthId;
export type RoleId = string;
export type PermissionKey = `${string}.${string}`;

export type User = InferSelect<typeof coreModels.user>;
export type NewUser = InferInsert<typeof coreModels.user>;
export type UserData = InferSelect<typeof coreModels.userData>;
export type NewUserData = InferInsert<typeof coreModels.userData>;
export type Hacker = InferSelect<typeof coreModels.hacker>;
export type NewHacker = InferInsert<typeof coreModels.hacker>;
export type Role = InferSelect<typeof coreModels.role>;
export type NewRole = InferInsert<typeof coreModels.role>;
export type UserBan = InferSelect<typeof coreModels.userBan>;
export type NewUserBan = InferInsert<typeof coreModels.userBan>;
