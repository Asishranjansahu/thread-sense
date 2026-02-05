import { Client, GatewayIntentBits } from 'discord.js';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

const API = process.env.API_URL || "http://localhost:5050";
const FRONTEND = process.env.FRONTEND_URL || "http://localhost:5173";

client.on('ready', () => {
    console.log(`🤖 ThreadSense Intelligence Bot active as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.content.startsWith('!summarize ')) {
        const url = message.content.split(' ')[1];

        try {
            message.channel.send(`🕵️‍♂️ **Infiltrating Frequency:** ${url}\nGathering intelligence...`);

            const res = await fetch(`${API}/summarize`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url })
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            message.reply({
                content: `🧬 **Neural Report Summary [${data.platform.toUpperCase()}]**\n*Category: ${data.category}*\n\n${data.summary}\n\n🔗 *Full archives accessible at:* ${FRONTEND}`
            });

        } catch (err) {
            message.reply(`⚠️ **Core Critical:** ${err.message}`);
        }
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);
