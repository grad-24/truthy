import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination } from 'src/paginate';
import { CommonDtoInterface } from '../common/interfaces/common-dto.interface';
import { CommonServiceInterface } from '../common/interfaces/common-service.interface';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServiceRepository } from './entities/service.repository';
import { ServiceSerializer } from './serializer/service.serializer';
import { ServiceEntity } from './entities/service.entity';

@Injectable()
export class ServicesService implements CommonServiceInterface<ServiceSerializer> {
  constructor(
    @InjectRepository(ServiceRepository)
    private readonly repository: ServiceRepository,
  ) { }

  /**
   * Create a new Service
   * @param createServiceDto
   */
  async create(createServiceDto: CreateServiceDto): Promise<ServiceSerializer> {
    return this.repository.createEntity(createServiceDto);
  }

  /**
   * Get paginated list of all Services
   * @param filter
   */
  findAll(filter: CommonDtoInterface): Promise<Pagination<ServiceSerializer>> {
    // Assuming a paginate method is defined in your repository
    return this.repository.paginate(filter, [], ['name']);
  }

  /**
   * Find Service by ID
   * @param id
   */
  async findOne(id: number): Promise<ServiceSerializer> {
    const service = await this.repository.get(id);
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return service;
  }

  /**
   * Update Service by ID
   * @param id
   * @param updateServiceDto
   */
  async update(id: number, updateServiceDto: UpdateServiceDto): Promise<ServiceSerializer> {
    const service = await this.repository.get(id);
    return this.repository.updateEntity(service, updateServiceDto);
  }

  /**
   * Remove Service by ID
   * @param id
   */
  async remove(id: number): Promise<void> {
    await this.findOne(id);
    this.repository.delete({ id });
  }


  /**
 * Get Services array by provided array of ids
 * @param ids
 */
  async whereInIds(ids: number[]): Promise<ServiceEntity[]> {
    const services = await this.repository
      .createQueryBuilder('service')
      .whereInIds(ids)
      .getMany();

    if (services.length !== ids.length) {
      throw new NotFoundException(`One or more services with the provided IDs were not found.`);
    }

    return services;
  }
}
