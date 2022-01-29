import {Database} from '../Database';

export class Captcha {
  constructor(private _userId: string){}
  public getCaptcha(): string|undefined {
    var db = Database.getDB()
    var r = db.prepare('SELECT * FROM captcha WHERE userid=?').get(this._userId)
    return r === undefined ? undefined : r.captchaContent;
  }
  public setCaptcha(captchaContent: string){
    var db = Database.getDB()
    var r = db.prepare('INSERT INTO captcha(userId, captchaContent, verified, remainings) VALUES (?, ?, ?, ?)')
    r.run(this._userId, captchaContent, 0, 3)
  }
  public verifiedCaptcha(){
    var db = Database.getDB()
    var r = db.prepare('UPDATE captcha SET verified=? WHERE userid=?')
    r.run(1, this._userId)
  }
  public getLastRemainings(): number{
    var db = Database.getDB()
    var r = db.prepare('SELECT * FROM captcha WHERE userid=?').get(this._userId)
    return r.remainings;
  }
  public substractOneRemaining(){
    var db = Database.getDB()
    var remainings = this.getLastRemainings()
    if(remainings === 0) return;
    remainings--;
    var r = db.prepare('UPDATE captcha SET remainings=? WHERE userid=?')
    r.run(remainings, this._userId)
  }
  public setNewCaptchaContent(captcha: string){
    var db = Database.getDB()
    var r = db.prepare('UPDATE captcha SET captchaContent=? WHERE userid=?')
    r.run(captcha, this._userId)
  }
  public deleteCaptcha(){
    var db = Database.getDB()
    var r = db.prepare('DELETE FROM captcha WHERE userid=?')
    r.run(this._userId)
  }
  public isVerifiedCaptcha(): boolean {
    var db = Database.getDB()
    var r = db.prepare('SELECT * FROM captcha WHERE userid=?').get(this._userId)
    return r.verfied;
  }
}