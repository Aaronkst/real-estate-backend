import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  password: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  isAgent?: boolean;
}

export class ListUserDto {
  skip?: string;
}

export class FindUserDto {
  @IsNotEmpty()
  id: string;
}
