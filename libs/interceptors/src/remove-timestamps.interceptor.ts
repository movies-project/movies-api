import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Model } from "sequelize-typescript";
import { map, Observable } from "rxjs";
import * as _ from "lodash";

@Injectable()
export class RemoveTimestampsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => {
        return RemoveTimestampsInterceptor.removeTimestamps(data);
      }),
    );
  }

  public static removeTimestamps(data: any): any {
    const FIELDS_TO_BE_REMOVED = ['createdAt', 'updatedAt'];
    if (data instanceof Model) {
      return _.omit(data.dataValues, FIELDS_TO_BE_REMOVED);
    }

    if (typeof data === 'object') {
      return _.omit(data, FIELDS_TO_BE_REMOVED);
    }

    return data;
  }
}