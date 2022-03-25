import { BadRequestException } from '@app/exceptions';
import Validator from '@app/libs/validator';
import { Request } from 'express';

export default class Pagination {
  static validate(req: Request, knownKeys: string[] = []) {
    const validator = new Validator(
      req.query,
      {
        perPage: 'number|gt:0',
        page: 'number|gt:0',
      },
      knownKeys
    );

    if (validator.isFailed()) {
      throw new BadRequestException(validator.firstError());
    }

    const { perPage = 10, page = 1 } = req.query;
    const limit = perPage ? parseInt(perPage as string, 10) : 10;
    const offset = page ? (+page - 1) * limit : 0;
    return {
      limit,
      offset,
      perPage: Number(perPage),
      page: Number(page),
    };
  }

  static totalPage(count: number, limit: number) {
    return Math.ceil(count / limit);
  }
}
