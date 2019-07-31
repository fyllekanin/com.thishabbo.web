const Discord = require('discord.js');
const client = new Discord.Client();

const TOKEN = '{token}';
let CHANNEL = null;

const events = [
    {
        event: 'messageDelete',
        message: 'deleted message'
    }
];

client.on('ready', () => {
    console.log(`Discord bot is ready`);
    CHANNEL = client.channels.get('587240431683764224');
});

events.forEach(event => {
    client.on(event.event, data => {
        if (!CHANNEL || data.channel.id === CHANNEL.id) {
            return;
        }
        const embed = new Discord.RichEmbed()
            .setTitle(`${data.author.username}#${data.author.discriminator} ${event.message}`)
            .setColor(0xFF0000)
            .setDescription(data.cleanContent);

        CHANNEL.send(embed);
    });
});

client.login(TOKEN);