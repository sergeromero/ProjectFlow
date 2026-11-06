
import {
    BadRequestException,
    ConflictException,
    NotFoundException
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

import { Provider } from '@/entities/provider.entity';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { ProvidersService } from './providers.service';

describe('ProvidersService', () => {
    let service: ProvidersService;

    let repository: jest.Mocked<
        Pick<Repository<Provider>, 'find' | 'findOneBy' | 'create' | 'save'>
    >;

    beforeEach(async () => {
        repository = {
            find: jest.fn(),
            findOneBy: jest.fn(),
            create: jest.fn(),
            save: jest.fn()
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProvidersService,
                {
                    provide: getRepositoryToken(Provider),
                    useValue: repository
                }
            ]
        }).compile();

        service = module.get<ProvidersService>(ProvidersService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('findAll', () => {
        it('should return providers ordered by name ascending', async () => {
            const providers = [
                { id: 2, name: 'Alpha Provider' },
                { id: 1, name: 'Beta Provider' }
            ] as Provider[];

            repository.find.mockResolvedValue(providers);

            const result = await service.findAll();

            expect(result).toBe(providers);
            expect(repository.find).toHaveBeenCalledWith({
                order: {
                    name: 'ASC'
                }
            });
        });
    });

    describe('create', () => {
        const dto: CreateProviderDto = {
            name: 'New Provider',
            email: 'new@example.com',
            phone: '5145551234'
        };

        it('should create and save a provider', async () => {
            const provider = {
                id: 1,
                ...dto
            } as Provider;

            repository.create.mockReturnValue(provider);
            repository.save.mockResolvedValue(provider);

            const result = await service.create(dto);

            expect(repository.create).toHaveBeenCalledWith(dto);
            expect(repository.save).toHaveBeenCalledWith(provider);
            expect(result).toBe(provider);
        });

        it('should throw ConflictException when the email already exists', async () => {
            const provider = { ...dto } as Provider;

            const queryError = new QueryFailedError(
                'INSERT INTO providers',
                [],
                Object.assign(new Error('Duplicate key'), {
                    code: '23505'
                })
            );

            repository.create.mockReturnValue(provider);
            repository.save.mockRejectedValue(queryError);

            await expect(service.create(dto)).rejects.toThrow(ConflictException);
        });

        it('should propagate unexpected database errors', async () => {
            const provider = { ...dto } as Provider;
            const databaseError = new Error('Database connection failed.');

            repository.create.mockReturnValue(provider);
            repository.save.mockRejectedValue(databaseError);

            await expect(service.create(dto)).rejects.toBe(databaseError);
        });
    });

    describe('findOne', () => {
        it('should return a provider when it exists', async () => {
            const provider = {
                id: 1,
                name: 'Test Provider',
                email: 'test@example.com'
            } as Provider;

            repository.findOneBy.mockResolvedValue(provider);

            const result = await service.findOne(1);

            expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
            expect(result).toBe(provider);
        });

        it('should throw NotFoundException when the provider does not exist', async () => {
            repository.findOneBy.mockResolvedValue(null);

            await expect(service.findOne(999)).rejects.toThrow(NotFoundException);

            expect(repository.findOneBy).toHaveBeenCalledWith({ id: 999 });
        });
    });

    describe('update', () => {
        let provider: Provider;

        beforeEach(() => {
            provider = {
                id: 1,
                name: 'Original Provider',
                email: 'original@example.com',
                phone: '5145551234'
            } as Provider;

            repository.findOneBy.mockResolvedValue(provider);
            repository.save.mockImplementation(
                async (entity) => entity as Provider
            );
        });

        it('should update the provider name', async () => {
            const dto: UpdateProviderDto = {
                name: 'Updated Provider'
            };

            const result = await service.update(1, dto);

            expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
            expect(provider.name).toBe('Updated Provider');
            expect(provider.email).toBe('original@example.com');
            expect(repository.save).toHaveBeenCalledWith(provider);
            expect(result).toBe(provider);
        });

        it('should update the provider email', async () => {
            const dto: UpdateProviderDto = {
                email: 'updated@example.com'
            };

            const result = await service.update(1, dto);

            expect(provider.email).toBe('updated@example.com');
            expect(provider.name).toBe('Original Provider');
            expect(repository.save).toHaveBeenCalledWith(provider);
            expect(result).toBe(provider);
        });

        it('should update the provider phone', async () => {
            const dto: UpdateProviderDto = {
                phone: '5145559999'
            };

            const result = await service.update(1, dto);

            expect(provider.phone).toBe('5145559999');
            expect(repository.save).toHaveBeenCalledWith(provider);
            expect(result).toBe(provider);
        });

        it('should allow clearing the provider phone', async () => {
            const dto: UpdateProviderDto = {
                phone: null
            };

            await service.update(1, dto);

            expect(provider.phone).toBeNull();
            expect(repository.save).toHaveBeenCalledWith(provider);
        });

        it('should reject an empty update', async () => {
            await expect(service.update(1, {})).rejects.toThrow(
                BadRequestException
            );

            expect(repository.findOneBy).not.toHaveBeenCalled();
            expect(repository.save).not.toHaveBeenCalled();
        });

        it('should throw NotFoundException when updating a missing provider', async () => {
            repository.findOneBy.mockResolvedValue(null);

            await expect(
                service.update(999, { name: 'Updated Provider' })
            ).rejects.toThrow(NotFoundException);

            expect(repository.save).not.toHaveBeenCalled();
        });

        it('should throw ConflictException when the updated email already exists', async () => {
            const dto: UpdateProviderDto = {
                email: 'existing@example.com'
            };

            const queryError = new QueryFailedError(
                'UPDATE providers',
                [],
                Object.assign(new Error('Duplicate key'), {
                    code: '23505'
                })
            );

            repository.save.mockRejectedValue(queryError);

            await expect(service.update(1, dto)).rejects.toThrow(
                ConflictException
            );
        });

        it('should propagate unexpected database errors', async () => {
            const dto: UpdateProviderDto = {
                name: 'Updated Provider'
            };

            const databaseError = new Error('Database connection failed.');

            repository.save.mockRejectedValue(databaseError);

            await expect(service.update(1, dto)).rejects.toBe(databaseError);
        });
    });
});
