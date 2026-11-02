import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

import { Customer } from '@/entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomersService } from './customers.service';

describe('CustomersService', () => {
  let service: CustomersService;
  let repository: jest.Mocked<
    Pick<Repository<Customer>, 'find' | 'findOneBy' | 'create' | 'save'>
  >;

  beforeEach(async () => {
    repository = {
      find: jest.fn(),
      findOneBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        {
          provide: getRepositoryToken(Customer),
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return customers ordered by name ascending', async () => {
      const customers = [
        { id: 2, name: 'Alpha Customer' },
        { id: 1, name: 'Beta Customer' },
      ] as Customer[];

      repository.find.mockResolvedValue(customers);

      const result = await service.findAll();

      expect(result).toBe(customers);
      expect(repository.find).toHaveBeenCalledWith({
        order: {
          name: 'ASC',
        },
      });
    });
  });

  describe('create', () => {
    const dto: CreateCustomerDto = {
      name: 'New Customer',
      email: 'new@example.com',
    };

    it('should create and save a customer', async () => {
      const customer = {
        id: 1,
        name: dto.name,
        email: dto.email,
        isActive: true,
      } as Customer;

      repository.create.mockReturnValue(customer);
      repository.save.mockResolvedValue(customer);

      const result = await service.create(dto);

      expect(repository.create).toHaveBeenCalledWith({
        name: dto.name,
        email: dto.email,
      });

      expect(repository.save).toHaveBeenCalledWith(customer);
      expect(result).toBe(customer);
    });

    it('should throw ConflictException when the email already exists', async () => {
        const customer = {
            name: dto.name,
            email: dto.email,
        } as Customer;

        const queryError = new QueryFailedError(
            'INSERT INTO customers',
            [],
            Object.assign(new Error('Duplicate key'), {
            code: '23505',
            }),
        );

        repository.create.mockReturnValue(customer);
        repository.save.mockRejectedValue(queryError);

        try {
            await service.create(dto);
            fail('Expected service.create() to throw ConflictException');
        } catch (error: unknown) {
            expect(error).toBeInstanceOf(ConflictException);
            expect((error as ConflictException).message).toBe(
            'A customer with this email already exists.',
            );
        }
    });

    it('should propagate unexpected database errors', async () => {
      const customer = {
        name: dto.name,
        email: dto.email,
      } as Customer;

      const databaseError = new Error('Database connection failed');

      repository.create.mockReturnValue(customer);
      repository.save.mockRejectedValue(databaseError);

      await expect(service.create(dto)).rejects.toBe(databaseError);
    });
  });

  describe("findOne", () => {
    it("should return a customer when it exists", async () => {
      const customer = {
        id: 1,
        name: "Test Customer",
        email: "test@email.com"
      } as Customer;

      repository.findOneBy.mockResolvedValue(customer);

      const result = await service.findOne(1);

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toBe(customer);
    });
    
    it("should throw NotFoundException when the customer does not exist", async () => {
      repository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 999});
    });
  });

  describe("update", () => {
    let customer: Customer;

    beforeEach(() => {
      customer = {
        id: 1,
        name: "Original Customer",
        email: "original@email.com",
        isActive: true
      } as Customer;

      repository.findOneBy.mockResolvedValue(customer);
      repository.save.mockImplementation(async (entity) => entity as Customer);
    });

    it("should update the customer name", async () => {
      const dto: UpdateCustomerDto = {
        name: "Updated Customer"
      };

      const result = await service.update(1, dto);

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(customer.name).toBe("Updated Customer");
      expect(customer.email).toBe("original@email.com");
      expect(repository.save).toHaveBeenCalledWith(customer);
      expect(result).toBe(customer);
    });

    it("should update the customer email", async () => {
      const dto: UpdateCustomerDto = {
        email: "updated@newdomain.com"
      };

      const result = await service.update(1, dto);

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(customer.email).toBe("updated@newdomain.com");
      expect(customer.name).toBe("Original Customer");
      expect(repository.save).toHaveBeenCalledWith(customer);
      expect(result).toBe(customer);
    });

    it("should update both customer properties", async () => {
      const dto: UpdateCustomerDto = {
        name: "Second updated",
        email: "second_updated@olddomain.com"
      };

      const result = await service.update(1, dto);

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(customer.name).toBe("Second updated");
      expect(customer.email).toBe("second_updated@olddomain.com");
      expect(repository.save).toHaveBeenCalledWith(customer);
      expect(result).toBe(customer);
    });

    it("should throw BadRequestException when the customer does not exist", async () => {
      await expect(service.update(1, {})).rejects.toThrow(BadRequestException);

      expect(repository.save).not.toHaveBeenCalled();
    });

    it("should throw NotFoundException when the customer does not exist", async () => {
      const anyId: number = 999;
      repository.findOneBy.mockResolvedValue(null);

      await expect(service.update(anyId, { name: "New Name" })).rejects.toThrow(NotFoundException);

      expect(repository.save).not.toHaveBeenCalled();
    });

    it("should throw ConflicException when the updated email already exists", async () => {
      const dto: UpdateCustomerDto = {
        email: "existing@email.com"
      };

      const queryError = new QueryFailedError("UPDATE customers",
        [],
        Object.assign(new Error("Duplicate key"), {
          code: "23505",
        }),
      );

      repository.save.mockRejectedValue(queryError);

      await expect(service.update(1, dto)).rejects.toThrow(ConflictException);
    });

    it("should propagate unexpected database errors", async () => {
      const dto: UpdateCustomerDto = {
        name: "Updated Customer"
      };

      const databaseError = new Error("Database connection failed.");

      repository.save.mockRejectedValue(databaseError);

      await expect(service.update(1, dto)).rejects.toBe(databaseError);
    });    
  });
});