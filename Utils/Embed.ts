export class Embed {
  public static resolveFooter(client){
    var date = new Date().toLocaleDateString('fr-FR')
    return { text: 'DiscGuard | ' + date, iconURL: client.user.displayAvatarURL() };
  }
}