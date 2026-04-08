const { createCanvas, loadImage } = require('canvas');

module.exports = async (member) => {
    const canvas = createCanvas(1000, 400);
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = "#0f0f0f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Gradient glow
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, "#8a2be2");
    gradient.addColorStop(1, "#5865F2");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, 10);

    // Avatar
    const avatar = await loadImage(
        member.user.displayAvatarURL({ extension: 'png', size: 256 })
    );

    ctx.save();
    ctx.beginPath();
    ctx.arc(200, 200, 80, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(avatar, 120, 120, 160, 160);
    ctx.restore();

    // Username
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 40px sans-serif";
    ctx.fillText(member.user.username, 350, 180);

    // Welcome text
    ctx.font = "28px sans-serif";
    ctx.fillStyle = "#aaaaaa";
    ctx.fillText("Welcome to Tube Sensei", 350, 230);

    return canvas.toBuffer();
};