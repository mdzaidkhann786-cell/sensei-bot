const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('abtest')
        .setDescription('Run A/B thumbnail test')
        .addAttachmentOption(opt =>
            opt.setName('image_a')
                .setDescription('Thumbnail A')
                .setRequired(true))
        .addAttachmentOption(opt =>
            opt.setName('image_b')
                .setDescription('Thumbnail B')
                .setRequired(true))
        .addIntegerOption(opt =>
            opt.setName('duration')
                .setDescription('Duration in minutes')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(interaction) {
        const imgA = interaction.options.getAttachment('image_a');
        const imgB = interaction.options.getAttachment('image_b');
        const duration = interaction.options.getInteger('duration');

        if (!imgA || !imgB) {
            return interaction.reply({
                content: "❌ Please upload both images properly.",
                ephemeral: true
            });
        }

        const votes = { A: new Set(), B: new Set() };

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('vote_A')
                .setLabel('🅰️ Vote A')
                .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
                .setCustomId('vote_B')
                .setLabel('🅱️ Vote B')
                .setStyle(ButtonStyle.Success)
        );

        const message = await interaction.reply({
            content: "🧪 **Thumbnail A/B Test**\nVote below 👇",
            embeds: [
                {
                    title: "🅰️ Option A",
                    image: { url: imgA.url },
                    color: 0x5865F2
                },
                {
                    title: "🅱️ Option B",
                    image: { url: imgB.url },
                    color: 0x57F287
                }
            ],
            components: [row],
            fetchReply: true
        });

        const collector = message.createMessageComponentCollector({
            time: duration * 60000
        });

        collector.on('collect', async i => {
            const userId = i.user.id;

            votes.A.delete(userId);
            votes.B.delete(userId);

            if (i.customId === 'vote_A') votes.A.add(userId);
            else votes.B.add(userId);

            await i.reply({
                content: "✅ Vote recorded",
                ephemeral: true
            });
        });

        collector.on('end', async () => {
            const countA = votes.A.size;
            const countB = votes.B.size;

            let result = "📊 **Results:**\n";
            if (countA > countB) result += "🏆 A Wins!";
            else if (countB > countA) result += "🏆 B Wins!";
            else result += "🤝 It's a Tie!";

            result += `\n\n🅰️ A: ${countA}\n🅱️ B: ${countB}`;

            const disabledRow = new ActionRowBuilder().addComponents(
                row.components.map(btn => ButtonBuilder.from(btn).setDisabled(true))
            );

            await message.edit({ components: [disabledRow] });
            await interaction.followUp(result);
        });
    }
};