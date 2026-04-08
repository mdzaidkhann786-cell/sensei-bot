const Parser = require('rss-parser');
const cron = require('node-cron');
const parser = new Parser();
const config = require('../config.json');

let lastVideo = null;

module.exports = (client) => {
    cron.schedule('*/2 * * * *', async () => {
        try {
            const feed = await parser.parseURL(
                `https://www.youtube.com/feeds/videos.xml?channel_id=${config.channel_id}`
            );

            const latest = feed.items[0];
            if (!latest) return;

            if (latest.id === lastVideo) return;
            lastVideo = latest.id;

            // 🔥 Extract video ID safely
            const videoId = latest.id.split(':').pop();

            // 🔥 Fallback thumbnail
            const thumbnail = latest.media_thumbnail?.[0]?.url ||
                `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

            const channel = client.channels.cache.get(config.announce_channel);

            if (!channel) return;

            await channel.send({
                embeds: [{
                    title: latest.title,
                    url: latest.link,
                    description: "🚀 New video uploaded!",
                    image: { url: thumbnail },
                    color: 0xff0000
                }]
            });

        } catch (err) {
            console.error("YouTube RSS Error:", err);
        }
    });
};