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
            console.log("📱 امسح QR من واتساب:")
            console.log(qr)
        }

        if (connection === "open") {
            console.log("✅ البوت اشتغل بنجاح")
        }

        if (connection === "close") {
            console.log("❌ انقطع الاتصال")

            if (lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) {
                startBot()
            }
        }
    })
}

startBot()

console.log("🚀 البوت بدأ التشغيل")
