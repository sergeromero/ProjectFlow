import { Transform } from "class-transformer";
import { IsString, IsOptional, IsEmail, MaxLength, IsNotEmpty, ValidateIf } from "class-validator";

export class UpdateProviderDto {
    @ValidateIf((_object, value) => value !== undefined)
    @Transform(({ value }) => value === "string" ? value.trim() : value)
    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    name?: string;

    @ValidateIf((_object, value) => value !== undefined)
    @Transform(({ value }) => value === "string" ? value.trim().toLowerCase() : value)
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @MaxLength(254)
    email?: string;

    @ValidateIf((_object, value) => value !== undefined)
    @Transform(({ value }) => value === "string" ? value.trim() || null : value)
    @IsOptional()
    @IsString()
    @MaxLength(30)
    phone?: string | null;
}