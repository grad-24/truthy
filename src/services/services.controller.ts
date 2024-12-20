import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ForbiddenException, UseGuards } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ParseIntPipe } from '@nestjs/common';
import { PermissionGuard } from 'src/common/guard/permission.guard';
import JwtTwoFactorGuard from 'src/common/guard/jwt-two-factor.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ServiceSerializer } from './serializer/service.serializer';
import { CommonSearchFieldDto } from 'src/common/extra/common-search-field.dto';
import { Pagination } from 'src/paginate';

@ApiTags('services')
@ApiBearerAuth()
@UseGuards(JwtTwoFactorGuard)
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) { }

  @Post()
  create(@Body() createServiceDto: CreateServiceDto): Promise<ServiceSerializer> {
    return this.servicesService.create(createServiceDto);
  }

  @Get()
  findAll(
    @Query() filter: CommonSearchFieldDto
  ): Promise<Pagination<ServiceSerializer>> {
    return this.servicesService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<ServiceSerializer> {
    return this.servicesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateServiceDto: UpdateServiceDto
  ): Promise<ServiceSerializer> {
    return this.servicesService.update(id, updateServiceDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.servicesService.remove(id);
  }
}