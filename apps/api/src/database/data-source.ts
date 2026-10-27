import { config } from "dotenv";
import { resolve } from "node:path";
import { DataSource } from "typeorm";
import { Customer } from "../entities/customer.entity";

config({
    path: resolve(__dirname, "../../../../.env"),
});

export default new DataSource({
    type: "postgres",
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT ?? 5432),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,

    entities: [Customer],
    migrations: [resolve(__dirname, "migrations/*{.ts,.js}")],

    synchronize: false,
});