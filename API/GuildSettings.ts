import { Snowflake } from "discord-api-types";
import { Database } from "../Database";

export class GuildSettings {
  constructor(private _guild_id: number){}
  public isVerificationEnabled(): boolean{
    var db = Database.getDB()
    var r = db.prepare('SELECT * FROM settings WHERE verification_channel_id=?').get(this._guild_id)
    return r.verification_enabled;
  }
  public getVerificationGivenRoleId(): Snowflake|string {
    var db = Database.getDB();
    var r = db.prepare('SELECT * FROM settings WHERE verification_channel_id=?').get(this._guild_id)
    return r.verification_role_id;
  }
  public getVerificationChannelId(): Snowflake|string{
    var db = Database.getDB();
    var r = db.prepare('SELECT * FROM settings WHERE verification_channel_id=?').get(this._guild_id)
    return r.verification_channel_id;
  }
}