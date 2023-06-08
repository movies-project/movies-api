import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Model } from "sequelize-typescript";
import { map, Observable } from "rxjs";
import * as _ from "lodash";
import { RemoveTimestampsInterceptor } from "@app/interceptors/remove-timestamps.interceptor";

@Injectable()
export class SingleLevelTimestampsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => {
        return this.removeTimestamps(data);
      }),
    );
  }

  public removeTimestamps(data: any): any {
    const FIELDS_TO_BE_REMOVED = ['createdAt', 'updatedAt'];
    if (data instanceof Model) {
      return _.omit(data.dataValues, FIELDS_TO_BE_REMOVED);
    }

    if (typeof data === 'object') {
      Object.keys(data).forEach(key => {
        data[key] = RemoveTimestampsInterceptor.removeTimestamps(data[key]);
      });
    }

    return data;
  }
}