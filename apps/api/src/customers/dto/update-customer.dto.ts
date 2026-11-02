import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, MaxLength, ValidateIf } from "class-validator";

export class UpdateCustomerDto {
    @ValidateIf((_object, value) => value !== undefined)
    @Transform(({ value }) => typeof value === "string" ? value.trim() : value)
    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    name?: string;

    @ValidateIf((_object, value) => value !== undefined)
    @Transform(({ value }) => typeof value === "string" ? value.trim().toLowerCase() : value)
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @MaxLength(254)
    email?: string;
}