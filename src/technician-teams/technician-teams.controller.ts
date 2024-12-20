import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CommonSearchFieldDto } from 'src/common/extra/common-search-field.dto';
import JwtTwoFactorGuard from 'src/common/guard/jwt-two-factor.guard';
import { PermissionGuard } from 'src/common/guard/permission.guard';
import { Pagination } from 'src/paginate';
import { CreateTechnicianTeamDto } from './dto/create-technician-team.dto';
import { UpdateTechnicianTeamDto } from './dto/update-technician-team.dto';
import TechnicianTeamSerializer from './serializer/technician-team.serializer';
import { TechnicianTeamsService } from './technician-teams.service';
import { ParseDatePipe } from 'src/common/pipes/parse-date.pipe';
import { AvailableTeamDto } from './dto/available-team.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { TechnicianEntity, UserEntity } from 'src/auth/entity/user.entity';
import { ForbiddenException } from 'src/exception/forbidden.exception';

@ApiTags('technician-teams')
@ApiBearerAuth()
@UseGuards(JwtTwoFactorGuard, PermissionGuard)
@Controller('technician-teams')
export class TechnicianTeamsController {
  constructor(private readonly technicianTeamsService: TechnicianTeamsService) { }

  @Post()
  create(@Body() createTechnicianTeamDto: CreateTechnicianTeamDto): Promise<TechnicianTeamSerializer> {
    return this.technicianTeamsService.create(createTechnicianTeamDto);
  }

  @Get()
  findAll(
    @Query()
    filter: CommonSearchFieldDto
  ): Promise<Pagination<TechnicianTeamSerializer>> {
    return this.technicianTeamsService.findAll(filter);
  }

  // make sure this route is above @Get(':id') to avoid 'available-teams' being treated as an id
  @Get('available-teams')
  async getAvailableTeams(@Query('date', ParseDatePipe) date: Date): Promise<AvailableTeamDto[]> {
    return this.technicianTeamsService.getAvailableTeams(date);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @GetUser() currentUser: TechnicianEntity): Promise<TechnicianTeamSerializer> {
    // if the current user is a tech and not an admin, add additional constraints
    if ((currentUser.roleId === 3 || currentUser.roleId === 4) && currentUser.teamId !== id)
      throw new ForbiddenException();

    return this.technicianTeamsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateTechnicianTeamDto: UpdateTechnicianTeamDto, @GetUser() currentUser: TechnicianEntity): Promise<TechnicianTeamSerializer> {
    // if the current user is a tech-leader and not an admin, add additional constraints
    if (currentUser.roleId === 4 && currentUser.teamId !== id) {
      throw new ForbiddenException();
    }

    return this.technicianTeamsService.update(id, updateTechnicianTeamDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.technicianTeamsService.remove(id);
  }

}