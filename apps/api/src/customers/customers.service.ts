import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { QueryFailedError, Repository } from "typeorm";
import { Customer } from "@/entities/customer.entity";
import { CreateCustomerDto } from "./dto/create-customer.dto";

@Injectable()
export class CustomersService {
    constructor(@InjectRepository(Customer) private readonly customerRepository: Repository<Customer>){}

    async findAll(): Promise<Customer[]> {
        return this.customerRepository.find({
            order: {
                name: "ASC"
            }
        });
    }

    async create(dto: CreateCustomerDto): Promise<Customer> {
        const customer = this.customerRepository.create({
            name: dto.name,
            email: dto.email
        });

        try {
            return await this.customerRepository.save(customer);
        } catch (error: unknown) {
            if (
                error instanceof QueryFailedError &&
                "driverError" in error &&
                typeof error.driverError === "object" &&
                error.driverError !== null &&
                "code" in error.driverError &&
                error.driverError.code === "23505"
            ) {
                throw new ConflictException("A customer with this email already exists.");
            }

            throw error;
        }
    }
}