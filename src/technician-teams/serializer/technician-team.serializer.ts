import { ApiProperty } from "@nestjs/swagger";
import { UserSerializer } from "src/auth/serializer/user.serializer";
import { ModelSerializer } from "src/common/serializer/model.serializer";
import { OrderSerializer } from "src/orders/serializer/order.serializer";

export default class TechnicianTeamSerializer extends ModelSerializer {
    @ApiProperty()
    name: string;

    @ApiProperty()
    busyTimes: Array<{
        start_date: string;
        end_date: string;
        order_id: string;
    }>;

    @ApiProperty()
    dailyBreaks: Array<{
        start_hour: string;
        end_hour: string;
    }>;

    @ApiProperty()
    orders: OrderSerializer[];

    @ApiProperty()
    technicians: UserSerializer[];
}