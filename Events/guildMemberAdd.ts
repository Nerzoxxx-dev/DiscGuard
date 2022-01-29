import {Captcha} from 'captcha-canvas'
import { Collection, GuildMember, Message, MessageAttachment, MessageEmbed } from 'discord.js';
import { Captcha as UserCaptcha } from '../API/Captcha';
import { GuildSettings } from "../API/GuildSettings"

module.exports = async function(client, member: GuildMember){
  captchaFunc(client, member)
}

async function captchaFunc(client, member: GuildMember){
  if(member.user.bot) return;
  var guildSettings = new GuildSettings({guildId: member.guild.id});
  if(guildSettings.isVerificationEnabled()){
    var verificationChannel = client.channels.cache.get(guildSettings.getVerificationChannelId())
    var captcha = new Captcha()
    captcha.async = true;
    captcha.addDecoy();
    captcha.drawTrace();
    captcha.drawCaptcha();
    var userCaptcha = new UserCaptcha(member.id)
    if(userCaptcha.getCaptcha() !== undefined){
      if(userCaptcha.isVerifiedCaptcha()) return;
      userCaptcha.setNewCaptchaContent(captcha.text);
    }else {
      userCaptcha.setCaptcha(captcha.text)
    }
    var message = verificationChannel.send({files: [new MessageAttachment(await captcha.png, 'captcha.png')], content: `<@${member.user.id}> , veuillez saisir les caractères de l'image ci-dessous pour valider le captcha. Il vous reste ${userCaptcha.getLastRemainings()} chances avant d'être exclu(e). Vous avez 30 secondes pour le remplir.`})
    const filter = (m) => m.author.id === member.user.id
    verificationChannel.awaitMessages({filter, max: 1, time: 30_000, errors: ['time']}).then(async collected => {
      var msg = collected.first()
      if(msg.content === userCaptcha.getCaptcha()){
        //message.then(m => m.delete())
        msg.delete()
        userCaptcha.verifiedCaptcha();
        if(member.guild.roles.cache.has(guildSettings.getVerificationGivenRoleId())){
          member.roles.add(guildSettings.getVerificationGivenRoleId())
        }
        if(member.guild.roles.cache.has(guildSettings.getVerificationGivenRoleId()) && member.roles.cache.has(guildSettings.getVerificationRoleToDeleteId())) {
          member.roles.remove(guildSettings.getVerificationRoleToDeleteId())
        }
      }else {
        //message.then(m => m.delete())
        msg.delete()
        if(userCaptcha.getLastRemainings() > 1){
          userCaptcha.substractOneRemaining()
          var message = verificationChannel.send(':x: Captcha incorrect, il vous reste ' + userCaptcha.getLastRemainings() + ' chances avant d\'être exclu(e)')
          return captchaFunc(client, member);
        }else {
          await member.user.send(':x: Vous avez dépassé toutes les chances autorisées et avez donc été exclu(e) de ' + member.guild.name + '.').catch((e) => {})
          if(member.kickable) return member.kick('Invalid captcha')
        }
      }
    }).catch(async e => {
      if(e instanceof Collection){
        //message.then(m => m.delete())
        await member.user.send(':x: Vous n\'avez pas rempli le captcha après les 15 secondes demandées, vous avez donc été exclu de ' + member.guild.name).catch((e) => {})
        if(member.kickable) return member.kick('Invalid captcha')
      }else {
        verificationChannel.send(':x: Une erreur s\'est produite.')
        console.log(e)
      }
    })
  }
}