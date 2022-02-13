import { Snowflake } from "discord-api-types";
import { Database } from "../Database";

interface IGuildSettings{
  guildId: Snowflake|string
}

export class GuildSettings {
  constructor(private options: IGuildSettings){}
  public hasSettings(): boolean {
    var db = Database.getDB()
    var r = db.prepare('SELECT * FROM settings WHERE guildId=?').get(this.options.guildId)
    return r !== undefined;
  }
  public setBase(roleId: Snowflake): void {
    var db = Database.getDB()
    db.prepare('INSERT INTO settings(guildId, verification_enabled, djRoleEnabled, djRoleId, welcomeChannelEnabled, goodbyeChannelEnabled) VALUES (?, ?, ?, ?, ?, ?)').run(this.options.guildId, 0, 1, roleId, 0, 0)
  }
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
  public resolvePrefix(): string{
    return 'd!';
  }
  public djRoleEnabled(): boolean {
    var db = Database.getDB()
    var r = db.prepare('SELECT * FROM settings WHERE guildId=?').get(this.options.guildId)
    return r.djRoleEnabled;
  }
  public getDjRoleId(): Snowflake|string|undefined {
    var db = Database.getDB()
    var r = db.prepare('SELECT * FROM settings WHERE guildId=?').get(this.options.guildId)
    return r.djRoleId;
  }
  public isWelcomeChannelEnabled(): boolean  {
    var db = Database.getDB()
    var r = db.prepare('SELECT * FROM settings WHERE guildId=?').get(this.options.guildId)
    return (r.welcomeChannelId !== undefined || r.welcomeChannelId !== null) && r.welcomeChannelEnabled
  }
  public isGoodbyeChannelEnabled(): boolean  {
    var db = Database.getDB()
    var r = db.prepare('SELECT * FROM settings WHERE guildId=?').get(this.options.guildId)
    return (r.goodbyeChannelId !== undefined || r.goodbyeChannelId !== null) && r.goodbyeChannelEnabled
  }
  public getWelcomeChannelId() {
    var db = Database.getDB()
    var r = db.prepare('SELECT * FROM settings WHERE guildId=?').get(this.options.guildId)
    return r.welcomeChannelId
  }
  public getGoodbyeChannelId() {
    var db = Database.getDB()
    var r = db.prepare('SELECT * FROM settings WHERE guildId=?').get(this.options.guildId)
    return r.goodbyeChannelId
  }
}