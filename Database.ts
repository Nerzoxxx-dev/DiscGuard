export class Database {
  public static getDB() {
    return require('better-sqlite3')('bot.sqlite3')
  }

  public static async init(){
    var db = this.getDB();
    db.exec('CREATE TABLE IF NOT EXISTS settings(guildId TEXT, verification_enabled BOOLEAN, verification_channel_id TEXT CAN BE NULL, verification_role_to_give_id TEXT CAN BE NULL, verification_role_to_delete_id TEXT CAN BE NULL, djRoleEnabled BOOLEAN, djRoleId TEXT CAN BE NULL, welcomeChannelEnabled BOOLEAN, welcomeChannelId TEXT CAN BE NULL, goodbyeChannelEnabled BOOLEAN, goodbyeChannelId TEXT CAN BE NULL)')
    db.exec('CREATE TABLE IF NOT EXISTS captcha(userid TEXT, captchaContent TEXT, verified BOOLEAN, remainings INTEGER)')
  }
}