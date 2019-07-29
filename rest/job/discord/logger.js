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
        let message = '**Log**\n';
        message += `User: ${data.author.username}#${data.author.discriminator} - ${event.message} in channel: **${data.channel.name}**\n`;
        message += '```';
        message += data.content;
        message += '```';
        CHANNEL.send(message);
    });
});

client.login(TOKEN);