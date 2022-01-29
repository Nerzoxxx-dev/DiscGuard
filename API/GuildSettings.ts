import { Snowflake } from "discord-api-types";
import { Database } from "../Database";

interface IGuildSettings{
  guildId: Snowflake|string
}

export class GuildSettings {
  constructor(private options: IGuildSettings){}
  public isVerificationEnabled(): boolean{
    var db = Database.getDB()
    var r = db.prepare('SELECT * FROM settings WHERE guildId=?').get(this.options.guildId)
    return r.verification_enabled;
  }
  public getVerificationGivenRoleId(): Snowflake|string {
    var db = Database.getDB();
    var r = db.prepare('SELECT * FROM settings WHERE guildId=?').get(this.options.guildId)
    return r.verification_role_to_give_id;
  }
  public getVerificationRoleToDeleteId(): Snowflake|string {
    var db = Database.getDB()
    var r = db.prepare('SELECT * FROM settings WHERE guildId=?').get(this.options.guildId)
    return r.verification_role_to_delete_id;
  }
  public getVerificationChannelId(): Snowflake|string{
    var db = Database.getDB();
    var r = db.prepare('SELECT * FROM settings WHERE guildId=?').get(this.options.guildId)
    return r.verification_channel_id;
  }
}