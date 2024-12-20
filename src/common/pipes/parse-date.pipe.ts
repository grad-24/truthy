import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { CustomHttpException } from 'src/exception/custom-http.exception';

@Injectable()
export class ParseDatePipe implements PipeTransform<string, Date> {
    transform(value: string): Date {
        const parsedDate = new Date(value);

        if (isNaN(parsedDate.getTime())) {
            throw new CustomHttpException('Invalid date format. Please provide a valid date.');
        }

        return parsedDate;
    }
}
