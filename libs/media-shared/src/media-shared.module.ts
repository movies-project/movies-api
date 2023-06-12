import { Module } from '@nestjs/common';
import { MediaSharedService } from "@app/media-shared/media-shared.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { FileModel } from "@app/media-shared/file.model";

@Module({
  imports: [
    SequelizeModule.forFeature([FileModel]),
  ],
  controllers: [],
  providers: [MediaSharedService],
  exports: [MediaSharedService]
})
export class MediaSharedModule {}
