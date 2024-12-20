import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
} from 'class-validator';

export function IsValidTimeRange(
    property: string,
    validationOptions?: ValidationOptions,
) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isValidTimeRange',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [property],
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const startDate = new Date((args.object as any)[args.constraints[0]]);
                    const endDate = new Date(value);

                    if (!startDate || !endDate) {
                        return false;
                    }

                    const startTime = startDate.getTime();
                    const endTime = endDate.getTime();

                    // Validate that both times are within the allowed range (8:00 AM - 12:00 AM)
                    const startHour = startDate.getHours();
                    const endHour = endDate.getHours();

                    const isValidStartHour = startHour >= 8 && startHour < 24;
                    const isValidEndHour = endHour >= 8 && endHour < 24;

                    if (!isValidStartHour || !isValidEndHour) {
                        return false;
                    }

                    // Ensure the end date is after the start date by at least 30 minutes
                    const isValidTimeDifference = (endTime - startTime) >= 30 * 60 * 1000;

                    // Ensure the time range is no more than 3 hours
                    const isWithinMaxRange = (endTime - startTime) <= 3 * 60 * 60 * 1000;

                    return (
                        endTime > startTime &&
                        isValidTimeDifference &&
                        isWithinMaxRange
                    );
                },
                defaultMessage(args: ValidationArguments) {
                    const startDate = new Date((args.object as any)[args.constraints[0]]);
                    const endDate = new Date(args.value);

                    const startHour = startDate.getHours();
                    const endHour = endDate.getHours();

                    if (startHour < 8 || startHour >= 24 || endHour < 8 || endHour >= 24) {
                        return `Schedule must be between 8:00 AM and 12:00 AM.`;
                    }

                    const startTime = startDate.getTime();
                    const endTime = endDate.getTime();

                    if (endTime - startTime < 30 * 60 * 1000) {
                        return `${args.property} must be at least 30 minutes later than ${args.constraints[0]}.`;
                    }

                    if (endTime - startTime > 3 * 60 * 60 * 1000) {
                        return `${args.property} cannot be more than 3 hours later than ${args.constraints[0]}.`;
                    }

                    return `${args.property} is invalid.`;
                },
            },
        });
    };
}
