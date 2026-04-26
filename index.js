const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require("@whiskeysockets/baileys")

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("session")

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true
    })

    sock.ev.on("creds.update", saveCreds)

    sock.ev.on("connection.update", (update) => {
        const { connection, qr, lastDisconnect } = update

        if (qr) {
            console.log("📱 امسح هذا QR من واتساب:")
            console.log(qr)
        }

        if (connection === "open") {
            console.log("✅ تم الاتصال بنجاح")
        }

        if (connection === "close") {
            const reason = lastDisconnect?.error?.output?.statusCode

            console.log("❌ انقطع الاتصال:", reason)

            // 🔁 إعادة تشغيل تلقائي
            if (reason !== DisconnectReason.loggedOut) {
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
            await sock.sendMessage(from, { text: "🏓 البوت شغال" })
        }
    })
}

startBot()

console.log("🚀 البوت بدأ التشغيل...")
