import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TechnicianTeamRepository } from './technician-team.repository';
import { TechnicianTeamsController } from './technician-teams.controller';
import { TechnicianTeamsService } from './technician-teams.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TechnicianTeamRepository]),
    AuthModule
  ],
  controllers: [TechnicianTeamsController],
  providers: [TechnicianTeamsService],
  exports: [TechnicianTeamsService]
})
export class TechnicianTeamsModule { }
