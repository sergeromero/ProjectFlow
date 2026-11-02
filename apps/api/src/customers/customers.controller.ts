import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Patch } from "@nestjs/common";
import { Customer } from "@/entities/customer.entity";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { UpdateCustomerDto } from "./dto/update-customer.dto";
import { CustomersService } from "./customers.service";

@Controller("customers")
export class CustomersController {
    constructor(private readonly customerService: CustomersService){}

    @Get()
    async findAll(): Promise<Customer[]> {
        return this.customerService.findAll();
    }

    @Get(":id")
    async findOne(@Param("id", ParseIntPipe) id: number): Promise<Customer> {
        return this.customerService.findOne(id);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() dto: CreateCustomerDto): Promise<Customer> {
        return this.customerService.create(dto);
    }

    @Patch(":id")
    async update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateCustomerDto): Promise<Customer> {
        return this.customerService.update(id, dto);
    }
}