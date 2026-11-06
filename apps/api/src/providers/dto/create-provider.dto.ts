import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateProviderDto {
    @Transform(({ value }) => typeof value === "string" ? value.trim() : value)
    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    name!: string;

    @Transform(({ value }) => typeof value === "string" ? value.trim().toLowerCase() : value)
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @MaxLength(254)
    email!: string;

    @Transform(({ value }) => value === "string" ? value.tri() || null : value)
    @IsOptional()
    @IsString()
    @MaxLength(30)
    phone?: string;
}