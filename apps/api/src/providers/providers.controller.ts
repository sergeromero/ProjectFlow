import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Patch } from "@nestjs/common";
import { Provider } from "@/entities/provider.entity";
import { CreateProviderDto } from "./dto/create-provider.dto";
import { UpdateProviderDto } from "./dto/update-provider.dto";
import { ProvidersService } from "./providers.service";

@Controller("providers")
export class ProvidersController {
    constructor(private readonly providerService: ProvidersService){}

    @Get()
    async findAll(): Promise<Provider[]> {
        return this.providerService.findAll();
    }

    @Get(":id")
    async findOne(@Param("id", ParseIntPipe) id: number): Promise<Provider> {
        return this.providerService.findOne(id);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() dto: CreateProviderDto): Promise<Provider> {
        return this.providerService.create(dto);
    }

    @Patch(":id")
    async update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateProviderDto): Promise<Provider> {
        return this.providerService.update(id, dto);
    }
}