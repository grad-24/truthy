export class AvailableSlotDto {
    start_hour: Date;
    end_hour: Date;
}

export class AvailableTeamDto {
    teamId: number;
    teamName: string;
    availableSlots: AvailableSlotDto[];
}