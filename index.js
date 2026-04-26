const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require("@whiskeysockets/baileys")

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("session")

    const sock = makeWASocket({
        auth: state
    })

    sock.ev.on("creds.update", saveCreds)

    sock.ev.on("connection.update", (update) => {
        const { connection, qr, lastDisconnect } = update

        if (qr) {
            console.log("📱 QR CODE:")
            console.log(qr)
        }

        if (connection === "open") {
            console.log("✅ البوت اشتغل")
        }

        if (connection === "close") {
            console.log("❌ انقطع الاتصال")

            if (lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) {
                startBot()
            }
        }
    })

    sock.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0]
        if (!msg.message) return

        const from = msg.key.remoteJid
        const text =
            msg.message.conversation ||
            msg.message.extendedTextMessage?.text ||
            ""

        if (text === "!بنج") {
            await sock.sendMessage(from, { text: "🏓 شغال" })
        }
    })
}

startBot()

console.log("🚀 البوت بدأ التشغيل")
