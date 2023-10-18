const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.initialize();

client.on("message", async (message) => {
  if (
    message.hasQuotedMsg &&
    (await message.getQuotedMessage()).hasMedia &&
    message.body === "!sticker"
  ) {
    console.log(message.body);
    const quotedMessage = message.getQuotedMessage();

    client.sendMessage(message.from, "Generating sticker, please wait...");

    const media = (await quotedMessage).downloadMedia();

    await message.reply(
      await media,
      (chatId = message.from),
      (options = {
        sendMediaAsSticker: true,
      })
    );
  }
});
