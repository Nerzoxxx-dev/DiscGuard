export class Database {
  public static getDB() {
    return require('better-sqlite3')('bot.sqlite3')
  }

  public static async init(){
    var db = this.getDB()
    db.exec('CREATE TABLE IF NOT EXISTS settings(verification_enabled BOOLEAN, verification_channel_id TEXT, verification_role_id TEXT)')
  }
}