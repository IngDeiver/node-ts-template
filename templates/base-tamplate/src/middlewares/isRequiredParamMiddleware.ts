import { isNotEmpty } from 'class-validator';
import {
  NextFunction, RequestHandler, Request, Response,
} from 'express';
import { HttpException } from '../exceptions';

const { ObjectId } = require('mongoose').Types;

/**
 *
 * Valid a value if is defined into req (body or params), default valid id from url and valid _id of mongodb
 * @category Middlewares
 * @param {any} value - the value to validate
 * @return {RequestHandler}  {RequestHandler}
 */
const isDefinedParam = (
  value: 'params' | 'body' = 'params',
  param: string = 'id',
  validateMongoId: boolean = true,
): RequestHandler => (req: Request, res: Response, next: NextFunction) => {
  const paramValue = req[value][param];
  const exist: boolean = isNotEmpty(paramValue);
  let isMongoId: boolean = false;

  if (validateMongoId) {
    isMongoId = ObjectId.isValid(paramValue);
    if (!exist || !isMongoId) {
      return next(
        new HttpException(400, `${param} is required and shoul be ObjectId`),
      );
    }
  } else if (!exist) return next(new HttpException(400, `${param} is required`));
  next();
};
export default isDefinedParam;
