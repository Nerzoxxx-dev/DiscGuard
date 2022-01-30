export class Embed {
  public static resolveFooter(user){
    return { text: `${user.username}#${user.discriminator}`, iconURL: user.displayAvatarURL() };
  }
}