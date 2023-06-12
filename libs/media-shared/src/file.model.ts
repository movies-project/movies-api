import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({
  tableName: 'file'
})
export class FileModel extends Model<FileModel> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  essenceTable: string;

  @Column({ type: DataType.STRING, allowNull: false})
  ext: string;
}