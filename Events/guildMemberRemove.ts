import { Captcha } from "../API/Captcha"

module.exports = function(client, member){
  new Captcha(member.user.id).deleteCaptcha()
}