import { Injectable, PipeTransform, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class TrimStringsPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value !== 'object' || value === null) {
      return value;
    }

    for (const key in value) {
      if (typeof value[key] === 'string') {
        value[key] = value[key].trim();
      }
    }

    return value;
  }
}
