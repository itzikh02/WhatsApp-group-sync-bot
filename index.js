const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth(),
});

client.on('qr', (qr) => {
    console.log("Scan the QR code to authenticate:");
    qrcode.generate(qr, { small: true });
});

client.on('ready', async () => {
    console.log('Bot is connected and ready!');

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
        // console.log(`Sticker received in group: ${chat.name}`);

        if (groupIds.includes(chat.id._serialized)) {
            // console.log(`Group with ID ${chat.id._serialized} and name ${chat.name} is in the list, forwarding to other groups...`);

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
                // console.log("Failed to download the sticker.");
            }
        }
    }
});

// TEST!

client.on('group_join', async (notification) => {
    const chat = await notification.getChat();

    const newParticipants = notification.recipientIds;

    for (const id of newParticipants) {
        const number = id.split('@')[0];

        if (!number.startsWith('972')) {
            console.log(`User ${number} is not from Israel. Removing...`);
            try {
                // await chat.removeParticipants([id]);
                console.log(`Removed ${number} from group ${chat.name}`);
            } catch (err) {
                console.error(`Failed to remove ${number}:`, err);
            }
        } else {
            console.log(`User ${number} is from IL, allowed to stay.`);
        }
    }
});

client.initialize();

client.initialize();