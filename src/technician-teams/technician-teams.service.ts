import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonDtoInterface } from 'src/common/interfaces/common-dto.interface';
import { CommonServiceInterface } from 'src/common/interfaces/common-service.interface';
import { Pagination } from 'src/paginate';
import { CreateTechnicianTeamDto } from './dto/create-technician-team.dto';
import TechnicianTeamSerializer from './serializer/technician-team.serializer';
import { TechnicianTeamRepository } from './technician-team.repository';
import { UpdateTechnicianTeamDto } from './dto/update-technician-team.dto';
import { AuthService } from 'src/auth/auth.service';
import { NotFoundException } from 'src/exception/not-found.exception';
import { TechnicianTeamEntity } from './entities/technician-team.entity';
import { AvailableTeamDto } from './dto/available-team.dto';

@Injectable()
export class TechnicianTeamsService implements CommonServiceInterface<TechnicianTeamSerializer> {
  constructor(
    @InjectRepository(TechnicianTeamRepository)
    private readonly repository: TechnicianTeamRepository,
    private readonly authService: AuthService
  ) {

  }

  /**
 * Get Technicians array
 * @param ids
 */
  async getTechniciansByIds(ids: number[]) {
    if (ids && ids.length > 0) {
      return await this.authService.whereInIds(ids);
    }
    return [];
  }

  /**
   * Create Technician Team
   * @param CreateTechnicianTeamDto
   */
  async create(createTechnicianTeamDto: CreateTechnicianTeamDto): Promise<TechnicianTeamSerializer> {
    const technicians = await this.getTechniciansByIds(createTechnicianTeamDto.technicians);
    delete createTechnicianTeamDto.technicians;
    return this.repository.createEntity({
      ...createTechnicianTeamDto,
      technicians
    }, ["technicians"]);
  }

  /**
   * Get all Technician Teams paginated list
   * @param filter
   */
  findAll(filter: CommonDtoInterface): Promise<Pagination<TechnicianTeamSerializer>> {
    return this.repository.paginate(filter, ["technicians"], ["name"]);
  }
  /**
   * Find Technician Team By Id
   * @param id
   */
  findOne(id: number): Promise<TechnicianTeamSerializer> {
    return this.repository.get(id, ["technicians"]);
  }

  /**
 * Update Technician Team by id
 * @param id
 * @param updateTechnicianTeamDto
 */
  async update(id: number, inputDto: UpdateTechnicianTeamDto): Promise<TechnicianTeamSerializer> {
    const team = await this.repository.get(id);
    const updateTeamDto: any = inputDto;

    if (inputDto.technicians?.length > 0) {
      const technicians = await this.getTechniciansByIds(inputDto.technicians);
      updateTeamDto.technicians = technicians;
    }
    return this.repository.updateEntity(team, updateTeamDto, ["technicians"]);
  }

  /**
 * Remove Technician Team By id
 * @param id
 */
  async remove(id: number): Promise<void> {
    await this.findOne(id);
    this.repository.delete({ id });
  }

  async findById(id: number): Promise<TechnicianTeamEntity> {
    const team = await this.repository.findOne({
      where: {
        id,
      }
    });

    if (!team)
      throw new NotFoundException(`Team ${id} Not Found`)

    return team;
  }

  async removeBusyTime(teamId: number, orderId: number) {
    const team = await this.findById(teamId);

    team.busyTimes = team.busyTimes.filter(time => time.order_id !== orderId);

    return this.repository.save(team);
  }

  async getAvailableTeams(date: Date): Promise<AvailableTeamDto[]> {
    const teams = await this.repository.find();

    const availableTeams: AvailableTeamDto[] = teams.map((team) => {
      // Define the allowed scheduling window
      const startOfDay = new Date(date);
      startOfDay.setHours(8, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(0, 0, 0, 0);
      endOfDay.setDate(endOfDay.getDate() + 1); // Move to the next day at 00:00 to mark end of day

      // Extract busy times for the specified date
      const busySlots = team.busyTimes.filter((slot) => {
        const slotDate = new Date(slot.start_date);
        return (
          slotDate.getFullYear() === date.getFullYear() &&
          slotDate.getMonth() === date.getMonth() &&
          slotDate.getDate() === date.getDate()
        );
      });

      // Add daily breaks as busy slots (e.g., from 10:00-12:00 and 16:00-19:00)
      const dailyBreaks = team.dailyBreaks.map((breakTime) => {
        const breakStart = new Date(date);
        const [breakStartHour, breakStartMinute] = breakTime.start_hour.split(':');
        breakStart.setHours(Number(breakStartHour), Number(breakStartMinute), 0, 0);

        const breakEnd = new Date(date);
        const [breakEndHour, breakEndMinute] = breakTime.end_hour.split(':');
        breakEnd.setHours(Number(breakEndHour), Number(breakEndMinute), 0, 0);

        return { start_date: breakStart, end_date: breakEnd };
      });

      // Combine busy times and daily breaks
      const combinedBusySlots = [...busySlots, ...dailyBreaks];

      // Sort the busy slots by start time
      combinedBusySlots.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());

      // Calculate available slots
      let currentStart = startOfDay;
      const availableSlots: Array<{ start_hour: Date; end_hour: Date }> = [];

      combinedBusySlots.forEach((slot) => {
        const slotStart = new Date(slot.start_date);
        const slotEnd = new Date(slot.end_date);

        if (currentStart < slotStart) {
          availableSlots.push({ start_hour: currentStart, end_hour: slotStart });
        }
        currentStart = slotEnd;
      });

      // Add the final slot if the last busy slot doesn't reach the end of the day
      if (currentStart < endOfDay) {
        availableSlots.push({ start_hour: currentStart, end_hour: endOfDay });
      }

      return {
        teamId: team.id,
        teamName: team.name,
        availableSlots,
      };
    });

    return availableTeams.filter((team) => team.availableSlots.length > 0);
  }

}
