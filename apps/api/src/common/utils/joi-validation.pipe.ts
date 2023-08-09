import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { ObjectSchema } from 'joi';


@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private readonly schema: ObjectSchema) {}

  transform(value: any) {
    const { error } = this.schema.validate(value);
    if (error) {
      throw new BadRequestException('Validation failed');
    }
    return value;
  }
}
