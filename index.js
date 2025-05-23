const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth(),
});

function log(type, message) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${type.toUpperCase()}] ${message}`);
}

console.log("Bot is starting")

client.on('qr', (qr) => {
    console.log("Scan the QR code to authenticate:");
    qrcode.generate(qr, { small: true });
});

client.on('ready', async () => {
    log('info', 'Bot is ready!');

    const chats = await client.getChats();
    console.log("List of chats:");

    chats.forEach(chat => {
        console.log(`Name: ${chat.name || "N/A"} | ID: ${chat.id._serialized}`);
    });
    
});

require('dotenv').config();

const groupIds = [
    process.env.GROUP_1,
    process.env.GROUP_2,
    process.env.GROUP_3,
    process.env.GROUP_4
];

client.on('message', async msg => {
    const chat = await msg.getChat();

    if (msg.type === 'sticker') {
        log('info', `Sticker received in group: ${chat.name}`);

        if (groupIds.includes(chat.id._serialized)) {
            // console.log(`Group with ID ${chat.id._serialized} and name ${chat.name} is in the list, forwarding to other groups...`);
            if (msg.hasMedia){
                try {
                    const media = await msg.downloadMedia();
                    if (media) {
                        for (const id of groupIds) {
                            if (id !== chat.id._serialized) { 
                                // console.log(`Forwarding sticker to ID: ${id}`);
                                const groupChat = await client.getChatById(id);
                                groupChat.sendMessage(media, { sendMediaAsSticker: true });
                                // console.log(`Sticker forwarded to group: ${groupChat.name}`);
                            }
                        }
                    } else {
                        log('error', `Media is null or empty`);
                    }
                } catch (err) {
                    log("error", `Failed to download the sticker: ${err.message}`);
                }
            }
        }
    }
});

client.initialize();