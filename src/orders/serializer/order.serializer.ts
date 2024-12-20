import { ApiProperty } from "@nestjs/swagger";
import { CustomerEntity } from "src/auth/entity/user.entity";
import { UserSerializer } from "src/auth/serializer/user.serializer";
import { ModelSerializer } from "src/common/serializer/model.serializer";
import { TechnicianTeamEntity } from "src/technician-teams/entities/technician-team.entity";
import TechnicianTeamSerializer from "src/technician-teams/serializer/technician-team.serializer";

export class OrderSerializer extends ModelSerializer {
    @ApiProperty({ description: 'Title of the order' })
    name: string;

    @ApiProperty({ description: 'Description of the work to be done' })
    description: string;

    @ApiProperty({ description: 'Status of the order', enum: ["to-do", "in-progress", "done"] })
    status: string;

    @ApiProperty({ description: 'Priority of the order ', enum: ["High", "Medium", "Low"] })
    priority: string;

    @ApiProperty({ description: 'Start date and time of the order' })
    start_date: Date;

    @ApiProperty({ description: 'End date and time of the order' })
    end_date: Date;

    @ApiProperty({ description: 'Total cost of the order' })
    total_cost: number;

    @ApiProperty({ description: 'Address where the service is performed' })
    location_address: string;

    @ApiProperty({ description: 'Latitude of the location (optional)', required: false })
    location_latitude?: number;

    @ApiProperty({ description: 'Longitude of the location (optional)', required: false })
    location_longitude?: number;

    @ApiProperty({ description: 'Foreign key linking to the Team' })
    teamId: number;

    @ApiProperty({ description: 'Technician Team' })
    team: TechnicianTeamSerializer;

    @ApiProperty({ description: 'Foreign key linking to the Customer' })
    customerId: number;

    @ApiProperty({ description: 'Customer' })
    customer: UserSerializer;

    @ApiProperty({ description: 'User who created the order' })
    created_by: string;

    @ApiProperty({ description: 'Timestamp of order creation' })
    created_at: Date;

    @ApiProperty({ description: 'User who last modified the order (optional)', required: false })
    modified_by?: string;

    @ApiProperty({ description: 'Timestamp of last modification (optional)', required: false })
    modified_at?: Date;
}
