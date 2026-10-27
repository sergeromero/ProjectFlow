import { DataSource } from 'typeorm';
import dataSource from '../src/database/data-source';
import { Customer } from '../src/entities/customer.entity';

describe('Database integration tests', () => {
  let database: DataSource;

  beforeAll(async () => {
    database = dataSource;

    if (!database.isInitialized) {
      await database.initialize();
    }
  });

  afterAll(async () => {
    if (database?.isInitialized) {
      await database.destroy();
    }
  });

  it('should persist and retrieve a customer from PostgreSQL', async () => {
    const customerRepository = database.getRepository(Customer);
    const customerName = `Integration Test ${Date.now()}`;

    const customer = customerRepository.create({
      name: customerName,
    });

    const savedCustomer = await customerRepository.save(customer);

    try {
      expect(savedCustomer.id).toBeGreaterThan(0);
      expect(savedCustomer.name).toBe(customerName);
      expect(savedCustomer.createdAt).toBeInstanceOf(Date);

      const retrievedCustomer = await customerRepository.findOneBy({
        id: savedCustomer.id,
      });

      expect(retrievedCustomer).not.toBeNull();
      expect(retrievedCustomer?.id).toBe(savedCustomer.id);
      expect(retrievedCustomer?.name).toBe(customerName);
      expect(retrievedCustomer?.createdAt).toBeInstanceOf(Date);
    } finally {
      await customerRepository.delete(savedCustomer.id);
    }
  });
});