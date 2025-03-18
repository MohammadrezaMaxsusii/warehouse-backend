import { IUser } from "../../user.interface";
import { IRole } from "../../../roles/role.interface";
import { BaseResponseDto } from "../../../shared/dtos/responses/base-response.dto";
import { IBaseModel } from "../../../shared";

export class UserResponseDto extends BaseResponseDto {
  username: string;
  email?: string;
  phoneNumber?: string;
  fullName?: string;
  roles?: IRole[];

  constructor(initial: Partial<IUser>) {
    super(initial as IBaseModel);

    this.username = initial.username as string;
    this.email = initial?.email;
    this.phoneNumber = initial?.phoneNumber;
    this.fullName = initial?.fullName;
    this.roles = initial?.roles as unknown as IRole[];
  }
}
