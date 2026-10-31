import { Transform } from "class-transformer";
import { isEmail, IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateCustomerDto {
    @Transform(({ value }) => 
        typeof value === "string" ? value.trim(): value
    )
    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    name!: string;

    @Transform(({ value }) => 
        typeof value === "string" ? value.trim().toLowerCase() : value
    )
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @MaxLength(254)
    email!: string;
}