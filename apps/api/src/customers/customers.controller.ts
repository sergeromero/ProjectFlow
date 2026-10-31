import { Body, Controller, Get, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { Customer } from "@/entities/customer.entity";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { CustomersService } from "./customers.service";

@Controller("customers")
export class CustomersController {
    constructor(private readonly customerService: CustomersService){}

    @Get()
    async findAll(): Promise<Customer[]> {
        return this.customerService.findAll();
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() dto: CreateCustomerDto): Promise<Customer> {
        return this.customerService.create(dto);
    }
}