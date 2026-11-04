import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { QueryFailedError, Repository } from "typeorm";
import { Customer } from "@/entities/customer.entity";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { UpdateCustomerDto } from "./dto/update-customer.dto";

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

    async findOne(id: number): Promise<Customer> {
        const customer = await this.customerRepository.findOneBy({ id });

        if (!customer) {
            throw new NotFoundException(`Customer with ID ${id} was not found.`)
        }

        return customer;
    }

    async update(id: number, dto: UpdateCustomerDto): Promise<Customer> {
        const customer = await this.findOne(id);

        if (dto.name === undefined && dto.email === undefined) {
            throw new BadRequestException("At least one customer property must be provided.");
        }

        if (dto.name !== undefined) {
            customer.name = dto.name;
        }

        if (dto.email !== undefined) {
            customer.email = dto.email;
        }

        try {
            return await this.customerRepository.save(customer);
        } catch (error: unknown) {
            if (error instanceof QueryFailedError 
                && "driverError" in error 
                && typeof error.driverError === "object"
                && error.driverError !== null
                && "code" in error.driverError
                && error.driverError.code === "23505") {
                    throw new ConflictException("A customer with this email already exists.")
            }

            throw error;
        }
    }

    async deactivate(id: number): Promise<Customer> {
        const customer = await this.findOne(id);

        if (!customer.isActive) {
            return customer;
        }

        customer.isActive = false;

        return this.customerRepository.save(customer);
    }
}