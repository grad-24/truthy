import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { TechnicianTeamsModule } from 'src/technician-teams/technician-teams.module';
import { OrderRepository } from './order.repository';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { MailModule } from 'src/mail/mail.module';
import { ServicesModule } from 'src/services/services.module';
import { OrderToServiceEntity } from './entities/order-service.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderRepository, OrderToServiceEntity]),
    AuthModule,
    TechnicianTeamsModule,
    MailModule,
    ServicesModule
  ],
  controllers: [OrdersController],
  providers: [OrdersService]
})
export class OrdersModule { }
