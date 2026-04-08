const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ai')
        .setDescription('Generate AI image')
        .addStringOption(opt =>
            opt.setName('prompt')
                .setDescription('Your prompt')
                .setRequired(true)),

    async execute(interaction) {
        const prompt = interaction.options.getString('prompt');

        const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;

        await interaction.reply({
            embeds: [{
                title: "🎨 AI Image",
                description: prompt,
                image: { url: url }
            }]
        });
    }
};