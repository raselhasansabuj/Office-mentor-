const express = require('express');
const cors = require('cors');
const { Client, GatewayIntentBits } = require('discord.js');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static('public')); // Serve the dashboard

// 1. SIMULATED DEVICE LAYER
const rooms = ['Drawing Room', 'Work Room 1', 'Work Room 2'];
let devices = [];

// Initialize 15 devices (3 rooms * (2 fans + 3 lights))
rooms.forEach(room => {
    for (let i = 1; i <= 2; i++) {
        devices.push({ id: `${room}-Fan-${i}`, type: 'Fan', room: room, status: 'OFF', powerDraw: 60, lastChanged: Date.now() });
    }
    for (let i = 1; i <= 3; i++) {
        devices.push({ id: `${room}-Light-${i}`, type: 'Light', room: room, status: 'OFF', powerDraw: 15, lastChanged: Date.now() });
    }
});

// Simulate dynamic changes every 15 seconds
setInterval(() => {
    const randomDeviceIndex = Math.floor(Math.random() * devices.length);
    const device = devices[randomDeviceIndex];
    device.status = device.status === 'ON' ? 'OFF' : 'ON';
    device.lastChanged = Date.now();
    console.log(`[Simulation] ${device.id} toggled to ${device.status}`);
}, 15000);

// Helper for alerts
function getAlerts() {
    const alerts = [];
    const now = new Date();
    const hour = now.getHours();
    
    devices.forEach(d => {
        if (d.status === 'ON') {
            // Check if ON after hours (9 AM - 5 PM)
            if (hour >= 17 || hour < 9) {
                alerts.push(`${d.id} in ${d.room} is ON outside office hours!`);
            }
            // Check if ON for more than 2 hours (Simulated here as 2 minutes for demo purposes)
            const timeDiff = now.getTime() - d.lastChanged;
            if (timeDiff > 120000) { 
                alerts.push(`${d.id} has been ON for a dangerously long time!`);
            }
        }
    });
    return alerts;
}

// 2. BACKEND API (For Web Dashboard)
app.get('/api/devices', (req, res) => res.json(devices));

app.get('/api/stats', (req, res) => {
    let totalPower = 0;
    const roomPower = { 'Drawing Room': 0, 'Work Room 1': 0, 'Work Room 2': 0 };

    devices.forEach(d => {
        if (d.status === 'ON') {
            totalPower += d.powerDraw;
            roomPower[d.room] += d.powerDraw;
        }
    });
    res.json({ totalPower, roomPower, alerts: getAlerts() });
});

// 3. DISCORD BOT INTEGRATION
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
client.once('ready', () => {
    console.log(`🤖 Discord Bot is online and logged in as ${client.user.tag}!`);
});

client.on('messageCreate', (message) => {
    console.log(`[DEBUG] I saw a message from ${message.author.username}: ${message.content}`);
    if (message.author.bot) return;

    const msg = message.content.toLowerCase();

    if (msg === '!status') {
        const drawOn = devices.filter(d => d.room === 'Drawing Room' && d.status === 'ON');
        const w1On = devices.filter(d => d.room === 'Work Room 1' && d.status === 'ON');
        const w2On = devices.filter(d => d.room === 'Work Room 2' && d.status === 'ON');
        
        message.reply(`Hey boss! Here's the scoop:\n- **Drawing Room:** ${drawOn.length} devices ON.\n- **Work Room 1:** ${w1On.length === 0 ? 'All good, everything is off!' : `${w1On.length} devices ON.`}\n- **Work Room 2:** ${w2On.length} devices ON.`);
    } 
    else if (msg.startsWith('!room')) {
        const args = message.content.split(' ');
        if (args.length < 2) return message.reply("Please specify a room! (e.g., `!room Drawing`)");
        
        const searchTarget = args.slice(1).join(' ').toLowerCase();
        const targetRoom = rooms.find(r => r.toLowerCase().includes(searchTarget));
        
        if (!targetRoom) return message.reply("Hmm, I can't find that room. Try 'Drawing Room', 'Work Room 1', or 'Work Room 2'.");

        const roomDevs = devices.filter(d => d.room === targetRoom);
        const active = roomDevs.filter(d => d.status === 'ON').map(d => d.type).join(', ');
        
        message.reply(`In **${targetRoom}**, ${active.length > 0 ? `the following are ON: ${active}` : 'everything is currently OFF. Nice and efficient!'}`);
    }
    else if (msg === '!usage') {
        const total = devices.reduce((sum, d) => d.status === 'ON' ? sum + d.powerDraw : sum, 0);
        message.reply(`Total power right now is **${total}W**. Keeping an eye on the bills for you! 💸`);
    }
});

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));

// client.login('YOUR_DISCORD_BOT_TOKEN_HERE');
