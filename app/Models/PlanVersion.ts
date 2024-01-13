import { DateTime } from "luxon";
import { BaseModel, BelongsTo, belongsTo, column } from "@ioc:Adonis/Lucid/Orm";
import Plan from "./Plan";

export default class PlanVersion extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public planId: number;

  @column()
  public isActive: boolean;

  @column()
  public versionNum: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @belongsTo(() => Plan)
  public plan: BelongsTo<typeof Plan>;
}
