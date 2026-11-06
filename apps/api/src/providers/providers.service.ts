import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { QueryFailedError, Repository } from "typeorm";
import { Provider } from "@/entities/provider.entity";
import { CreateProviderDto } from "./dto/create-provider.dto";
import { UpdateProviderDto } from "./dto/update-provider.dto";

@Injectable()
export class ProvidersService {
    constructor(@InjectRepository(Provider) private readonly providerRepository: Repository<Provider>){}

    async findAll(): Promise<Provider[]> {
        return this.providerRepository.find({
            order: {
                name: "ASC"
            }
        });
    }

    async findOne(id: number): Promise<Provider> {
        const provider = await this.providerRepository.findOneBy({ id });

        if (!provider) {
            throw new NotFoundException(`Provider with ID ${id} was not found.`);
        }

        return provider;
    }

    async create(dto: CreateProviderDto): Promise<Provider> {
        const provider = this.providerRepository.create(dto);

        try {
            return await this.providerRepository.save(provider);
        } catch (err: unknown) {
            this.handleDatabaseError(err);
        }
    }

    async update(id: number, dto: UpdateProviderDto): Promise<Provider> {
        if (Object.keys(dto).length === 0) {
            throw new BadRequestException("At least one filed must be provided.");
        }

        const provider = await this.findOne(id);

        Object.assign(provider, dto);

        try {
            return await this.providerRepository.save(provider);
        } catch (err: unknown) {
            this.handleDatabaseError(err);
        }
    }

    private handleDatabaseError(error: unknown): never {
        if (error instanceof QueryFailedError
            && (error as QueryFailedError & { driverError: { code?: string};}).driverError?.code === "23505"
        ) {
            throw new ConflictException("A Provider with this email already exists.");
        }

        throw error;
    }
}