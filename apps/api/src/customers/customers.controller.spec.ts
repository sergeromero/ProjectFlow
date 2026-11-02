import { Test, TestingModule } from '@nestjs/testing';

import { Customer } from '@/entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { UpdateCustomerDto } from './dto/update-customer.dto';

describe('CustomersController', () => {
  let controller: CustomersController;

  const mockCustomersService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn()
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomersController],
      providers: [
        {
          provide: CustomersService,
          useValue: mockCustomersService,
        },
      ],
    }).compile();

    controller = module.get<CustomersController>(CustomersController);
  });

  describe('findAll', () => {
    it('should return the customers provided by the service', async () => {
      const customers = [
        { id: 1, name: 'Alpha Customer' },
        { id: 2, name: 'Beta Customer' },
      ] as Customer[];

      mockCustomersService.findAll.mockResolvedValue(customers);

      const result = await controller.findAll();

      expect(mockCustomersService.findAll).toHaveBeenCalledTimes(1);
      expect(result).toBe(customers);
    });
  });

  describe('create', () => {
    it('should pass the DTO to the service and return the created customer', async () => {
      const dto: CreateCustomerDto = {
        name: 'New Customer',
        email: 'new@example.com',
      };

      const customer = {
        id: 1,
        name: dto.name,
        email: dto.email,
        isActive: true,
      } as Customer;

      mockCustomersService.create.mockResolvedValue(customer);

      const result = await controller.create(dto);

      expect(mockCustomersService.create).toHaveBeenCalledWith(dto);
      expect(mockCustomersService.create).toHaveBeenCalledTimes(1);
      expect(result).toBe(customer);
    });
  });

  describe('update', () => {
    it('should pass the customer ID and DTO to the service', async () => {
      const id = 1;

      const dto: UpdateCustomerDto = {
        name: 'Updated Customer',
      };

      const customer = {
        id,
        name: dto.name,
        email: 'original@example.com',
        isActive: true,
      } as Customer;

      mockCustomersService.update.mockResolvedValue(customer);

      const result = await controller.update(id, dto);

      expect(mockCustomersService.update).toHaveBeenCalledWith(id, dto);
      expect(mockCustomersService.update).toHaveBeenCalledTimes(1);
      expect(result).toBe(customer);
    });
  });  
});