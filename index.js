const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys")

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("session")

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true
    })

    sock.ev.on("creds.update", saveCreds)

    // 🟢 مهم جدًا: هذا لحل الاتصال + QR
    sock.ev.on("connection.update", (update) => {
        const { connection, qr } = update

        if (qr) {
            console.log("📱 امسح QR من هنا:")
            console.log(qr)
        }

        if (connection === "open") {
            console.log("✅ البوت اشتغل بنجاح")
        }

        if (connection === "close") {
            console.log("❌ تم قطع الاتصال - يعاد التشغيل")
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

console.log("🚀 البوت قيد التشغيل...")
