module.exports = async (client) => {
    client.on('messageReactionAdd', async (reaction, user) => {
        if (user.bot) return;

        const roleMap = {
            "💻": "Video Editor",
            "🎬": "Content Creator"
        };

        const roleName = roleMap[reaction.emoji.name];
        if (!roleName) return;

        const member = await reaction.message.guild.members.fetch(user.id);
        const role = reaction.message.guild.roles.cache.find(r => r.name === roleName);

        if (role) member.roles.add(role);
    });
};