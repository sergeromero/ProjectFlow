import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "customers"})
export class Customer {
    @PrimaryGeneratedColumn({ type: "integer" })
    id!: number;

    @Column({ type: "varchar", length: 150 })
    name!: string;

    @CreateDateColumn({ name: "created_at", type: "timestamptz"})
    createdAt!: Date;
}