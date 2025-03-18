import { body } from "express-validator";
import { Types } from "mongoose";
import { AddRoleToUserDto, IAddRoleToUser } from "./add-role-to-user.dto";

export interface IRemoveRoleFromUser extends IAddRoleToUser {}

export const RemoveRoleFromUserDto = AddRoleToUserDto;
