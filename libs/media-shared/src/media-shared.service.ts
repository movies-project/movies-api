import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/sequelize";
import { Repository } from 'sequelize-typescript';

import * as path from 'path';
import * as fs from 'fs/promises'
import { createWriteStream } from "fs";
import { createReadStream } from 'fs-extra';
import { extname } from 'path';
import * as mime from 'mime-types';

import { mediaConfig } from "./config/media.config";
import { FileModel } from "./file.model";

@Injectable()
export class MediaSharedService {
  constructor(
    @InjectModel(FileModel)
    private readonly fileRepository: Repository<FileModel>,
  ) {}

  static getFilePath(table: string, ext: string, id: number) {
    return path.resolve(mediaConfig.STORAGE_PATH, `${table}-${id}.${ext}`);
  }

  async create(table: string, file: Express.Multer.File): Promise<FileModel> {
    const transaction = await this.fileRepository.sequelize.transaction();
    try {
      const fileModel = await this.fileRepository.create(
        {
          essenceTable: table,
          ext: extname(file.originalname)
        },
        {
          transaction
        });

      await fs.access(mediaConfig.STORAGE_PATH, fs.constants.F_OK)
        .catch(() => fs.mkdir(mediaConfig.STORAGE_PATH));

      const filePath = MediaSharedService.getFilePath(table, fileModel.ext, fileModel.id);
      const writeStream = createWriteStream(filePath);

      console.log('writing %s...', filePath);

      writeStream.write(file.buffer);
      writeStream.end();

      await transaction.commit();
      return fileModel;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async download(res: Response, table: string, id: number): Promise<FileModel> {
    console.log(1);
    const fileModel = await this.fileRepository.findOne({
      where: {
        essenceTable: table,
        id
      }
    });

    console.log(MediaSharedService.getFilePath(table, fileModel.ext, id));
    const filePath = MediaSharedService.getFilePath(table, fileModel.ext, id);
    const fileExists = await fs.access(filePath, fs.constants.F_OK)
      .then(() => true)
      .catch(() => false);
    if (!fileExists)
      return;

    const mimeType = mime.lookup(filePath) || 'application/octet-stream';

    const fileStream = createReadStream(filePath, {
      headers: {
        'Content-Type': mimeType
      }
    });
    fileStream.pipe(res);

    return fileModel;
  }
}
