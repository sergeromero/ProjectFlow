import { Column, 
    CreateDateColumn, 
    Entity, 
    Index,
    PrimaryGeneratedColumn,
    UpdateDateColumn } from "typeorm";

@Entity({ name: "customers"})
export class Customer {
    @PrimaryGeneratedColumn({ type: "integer" })
    id!: number;

    @Column({ type: "varchar", length: 150 })
    name!: string;

    @Column({ type: "varchar", length: 254 })
    email!: string;

    @Column({ name: "is_active", type: "boolean", default: true
    })
    isActive!: boolean;

    @CreateDateColumn({ name: "created_at", type: "timestamptz"})
    createdAt!: Date;

    @UpdateDateColumn({ name: "updated_at", type: "timestamptz"} )
    updatedAt!: Date;
}