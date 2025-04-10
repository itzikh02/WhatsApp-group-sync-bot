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
    const chat = await msg.ge();

    if (msg.type === 'sticker') {
        console.log(`Sticker received in group: ${chat.name}`);

        if (groupIds.includes(chat.id._serialized)) {
            console.log(`Group with ID ${chat.id._serialized} and name ${chat.name} is in the list, forwarding to other groups...`);

            const media = await msg.downloadMedia();
            if (media) {
                
                for (const id of groupIds) {
                    if (id !== chat.id._serialized) { 
                        console.log(`Forwarding sticker to ID: ${id}`);
                        const groupChat = await client.getChatById(id);
                        groupChat.sendMessage(media, { sendMediaAsSticker: true });
                        console.log(`Sticker forwarded to group: ${groupChat.name}`);
                    }
                }
            } else {
                console.log("Failed to download the sticker.");
            }
        }
    }
});

// TEST!

client.on('group_join', async (notification) => {
    const { contact, chat } = notification;
    const phoneNumber = contact.id._serialized;
    
    const countryCode = phoneNumber.slice(0, 4);

    if (countryCode !== '+972') {
        console.log(`User ${contact.pushname} with phone number ${phoneNumber} is from country ${countryCode}. Kicking out...`);
        
        // await chat.removeParticipants([contact.id._serialized]);
    } else {
        console.log(`User ${contact.pushname} with phone number ${phoneNumber} is from country ${countryCode}.`);
    }
});

client.initialize();