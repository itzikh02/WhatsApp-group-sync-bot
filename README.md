# WhatsApp Group Sync Bot

This bot allows you to forward received stickers from one WhatsApp group to multiple other WhatsApp groups automatically. It uses the [whatsapp-web.js](https://wwebjs.dev/) library to interact with WhatsApp Web.

## Features

- Scan QR code for authentication.
- Forward received stickers from one group to other specified groups.
- Works with WhatsApp Web using Node.js.

## Prerequisites

To use this bot, you'll need the following:

- Node.js (v12 or higher)
- A WhatsApp account
- WhatsApp Web session on your browser
- Installed dependencies using npm

## Installation

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/itzikh02/WhatsApp-group-sync-bot.git
   cd WhatsApp-group-sync-bot
   ```

2. Install the required dependencies:

   ```bash
   npm install
   ```

## Configuration

1. Edit the `groupIds` array in `index.js` to include the WhatsApp group IDs you want to work with. You can get the group IDs from the WhatsApp Web API or by looking at the `chat.id._serialized` property of the group you want to forward messages from.
   
2. Modify the message event listener logic in `index.js` to match your use case. Currently, it forwards only stickers.

## Usage

1. Run the bot:

   ```bash
   node index.js
   ```

2. A QR code will appear in the terminal. Scan it using the WhatsApp mobile app to authenticate.

3. Once authenticated, the bot will start and listen for incoming messages. If a sticker is received in one of the specified groups, it will automatically forward it to the other groups in the list.

## Customization

You can easily customize the bot by adjusting the following:

- Modify the list of group IDs.
- Adjust the types of media that should be forwarded (currently set for stickers).
- Log additional information for debugging.

## Troubleshooting

- If the bot is unable to download the sticker, make sure the message contains a valid media attachment.
- Ensure the bot has the appropriate permissions in all involved groups to send messages.