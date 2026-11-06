import { Test, TestingModule } from '@nestjs/testing';

import { Provider } from '@/entities/provider.entity';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { ProvidersController } from './providers.controller';
import { ProvidersService } from './providers.service';

describe('ProvidersController', () => {
    let controller: ProvidersController;

    const mockProvidersService = {
        findAll: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        update: jest.fn()
    };

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProvidersController],
            providers: [
                {
                    provide: ProvidersService,
                    useValue: mockProvidersService
                }
            ]
        }).compile();

        controller = module.get<ProvidersController>(ProvidersController);
    });

    describe('findAll', () => {
        it('should return the providers provided by the service', async () => {
            const providers = [
                { id: 1, name: 'Alpha Provider' },
                { id: 2, name: 'Beta Provider' }
            ] as Provider[];

            mockProvidersService.findAll.mockResolvedValue(providers);

            const result = await controller.findAll();

            expect(mockProvidersService.findAll).toHaveBeenCalledTimes(1);
            expect(result).toBe(providers);
        });
    });

    describe('findOne', () => {
        it('should delegate the provider ID to the service', async () => {
            const provider = {
                id: 1,
                name: 'Test Provider',
                email: 'test@example.com'
            } as Provider;

            mockProvidersService.findOne.mockResolvedValue(provider);

            const result = await controller.findOne(1);

            expect(mockProvidersService.findOne).toHaveBeenCalledWith(1);
            expect(result).toBe(provider);
        });
    });

    describe('create', () => {
        it('should pass the DTO to the service and return the created provider', async () => {
            const dto: CreateProviderDto = {
                name: 'New Provider',
                email: 'new@example.com',
                phone: '5145551234'
            };

            const provider = {
                id: 1,
                ...dto
            } as Provider;

            mockProvidersService.create.mockResolvedValue(provider);

            const result = await controller.create(dto);

            expect(mockProvidersService.create).toHaveBeenCalledWith(dto);
            expect(mockProvidersService.create).toHaveBeenCalledTimes(1);
            expect(result).toBe(provider);
        });
    });

    describe('update', () => {
        it('should pass the provider ID and DTO to the service', async () => {
            const dto: UpdateProviderDto = {
                name: 'Updated Provider'
            };

            const provider = {
                id: 1,
                name: dto.name,
                email: 'original@example.com'
            } as Provider;

            mockProvidersService.update.mockResolvedValue(provider);

            const result = await controller.update(1, dto);

            expect(mockProvidersService.update).toHaveBeenCalledWith(1, dto);
            expect(mockProvidersService.update).toHaveBeenCalledTimes(1);
            expect(result).toBe(provider);
        });
    });
});
