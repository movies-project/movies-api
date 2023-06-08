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
    if (data instanceof Model) {
      return RemoveTimestampsInterceptor.removeTimestamps(data);
    }

    if (typeof data === 'object') {
      Object.keys(data).forEach(key => {
        data[key] = RemoveTimestampsInterceptor.removeTimestamps(data[key]);
      });
    }

    return data;
  }
}