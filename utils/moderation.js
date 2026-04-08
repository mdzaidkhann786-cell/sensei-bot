const bannedWords = ["badword1", "badword2"];

module.exports = async (message) => {
    const content = message.content.toLowerCase();

    for (let word of bannedWords) {
        if (content.includes(word)) {
            await message.delete();
            await message.member.timeout(60000);
            message.channel.send(`${message.author}, watch your language.`);
            break;
        }
    }
};