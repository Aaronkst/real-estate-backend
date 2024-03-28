import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  password: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  isPaid?: boolean;

  @IsNotEmpty()
  phone: number;

  @IsNotEmpty()
  address: string;

  address2?: string;

  @IsNotEmpty()
  identification: string;
}

export class ListUserDto {
  skip?: string;
}

export class FindUserDto {
  @IsNotEmpty()
  id: string;
}
