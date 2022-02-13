import {Captcha} from 'captcha-canvas'
import { Collection, GuildMember, Message, MessageAttachment, MessageEmbed } from 'discord.js';
import { Captcha as UserCaptcha } from '../API/Captcha';
import { GuildSettings } from "../API/GuildSettings"
import * as Canvas from 'canvas';
import { applyText } from '../Utils/CanvasUtils';

Canvas.registerFont('./public/fonts/Fried Churros.ttf', {family: 'Heartbeat'})

module.exports = async function(client, member: GuildMember){
  captchaFunc(client, member)
  var gSettings = new GuildSettings({guildId: member.guild.id})
  if(gSettings.isWelcomeChannelEnabled){
    var welcomeChannel = client.channels.cache.get(gSettings.getWelcomeChannelId())
    if(welcomeChannel !== undefined){
      const canvas = Canvas.createCanvas(700, 250);
		  const context = canvas.getContext('2d');
      const background = await Canvas.loadImage('./public/img/welcome_background.png')
      context.drawImage(background, 0, 0, canvas.width, canvas.height)
      context.font = `50px Heartbeat`
      context.fillStyle = '#fff';
      context.fillText('Bienvenue à ', canvas.width / 2.5, canvas.height / 3.6);
      context.font = applyText(canvas, member.displayName, 70, 'Heartbeat')
      context.fillStyle = '#fff';
      context.fillText(member.displayName, canvas.width / 2.5, canvas.height / 2);
      context.font = `50px Heartbeat`
      context.fillStyle = '#fff';
      context.fillText(`Sur le serveur`, canvas.width / 2.5, canvas.height / 1.5);
      context.font = applyText(canvas, member.guild.name, 70, 'Heartbeat')
      context.fillStyle = '#fff';
      context.fillText(member.guild.name, canvas.width / 2.5, canvas.height / 1.15);
      context.strokeStyle = '#fff';
      context.strokeRect(0, 0, canvas.width, canvas.height)
      context.beginPath();
      context.arc(125, 125, 100, 0, Math.PI * 2, true)
      context.closePath()
      context.clip()
      const avatar = await Canvas.loadImage(member.user.displayAvatarURL({format: 'jpg'}))
      context.drawImage(avatar, 25, 25, 200, 200)
      const attachment = new MessageAttachment(canvas.toBuffer(), 'bienvenu.png')
      welcomeChannel.send({files: [attachment]})
    }
  }
}

async function captchaFunc(client, member: GuildMember){
  if(member.user.bot) return;
  var guildSettings = new GuildSettings({guildId: member.guild.id});
  if(guildSettings.isVerificationEnabled()){
    var verificationChannel = client.channels.cache.get(guildSettings.getVerificationChannelId())
    if(verificationChannel !== undefined){
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
      const message = await verificationChannel.send({files: [new MessageAttachment(await captcha.png, 'captcha.png')], content: `<@${member.user.id}> , veuillez saisir les caractères de l'image ci-dessous pour valider le captcha. Il vous reste ${userCaptcha.getLastRemainings()} chances avant d'être exclu(e). Vous avez 30 secondes pour le remplir.`})
      const filter = (m) => m.author.id === member.user.id
      verificationChannel.awaitMessages({filter, max: 1, time: 30_000, errors: ['time']}).then(async (collected) => {
        var msg = collected.first()
        if(msg.content === userCaptcha.getCaptcha()){
          message.delete()
          msg.delete()
          userCaptcha.verifiedCaptcha();
          if(member.guild.roles.cache.has(guildSettings.getVerificationGivenRoleId())){
            member.roles.add(guildSettings.getVerificationGivenRoleId())
          }
          if(member.guild.roles.cache.has(guildSettings.getVerificationGivenRoleId()) && member.roles.cache.has(guildSettings.getVerificationRoleToDeleteId())) {
            member.roles.remove(guildSettings.getVerificationRoleToDeleteId())
          }
        }else {
          message.delete()
          msg.delete()
          if(userCaptcha.getLastRemainings() > 1){
            userCaptcha.substractOneRemaining()
            var messageIncorrect = await verificationChannel.send(':x: Captcha incorrect, il vous reste ' + userCaptcha.getLastRemainings() + ' chances avant d\'être exclu(e)')
            setTimeout(() => messageIncorrect.delete(), 5000)
            return captchaFunc(client, member);
          }else {
            await member.user.send(':x: Vous avez dépassé toutes les chances autorisées et avez donc été exclu(e) de ' + member.guild.name + '.').catch((e) => {})
            if(member.kickable) return member.kick('Invalid captcha')
          }
        }
      }).catch(async e => {
        if(e instanceof Collection){
          message.delete()
          await member.user.send(':x: Vous n\'avez pas rempli le captcha après les 15 secondes demandées, vous avez donc été exclu de ' + member.guild.name).catch((e) => {})
          if(member.kickable) return member.kick('Invalid captcha')
        }else {
          verificationChannel.send(':x: Une erreur s\'est produite.')
        }
      })
    }
  }
}