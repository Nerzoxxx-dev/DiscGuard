"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
module.exports.run = (client, interaction) => {
    interaction.reply('it\'s good');
};
module.exports.help = {
    name: 'gif',
    data: new builders_1.SlashCommandBuilder().setName('gif')
        .setDescription('Sends a random gif!')
        .addStringOption(option => option.setName('category')
        .setDescription('The gif category')
        .setRequired(true)
        .addChoice('Funny', 'gif_funny')
        .addChoice('Meme', 'gif_meme')
        .addChoice('Movie', 'gif_movie')),
};
