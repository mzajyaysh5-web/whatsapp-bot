const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys")

// 👑 معلوماتك
const BOT_NAME = "مايكي بوت"
const OWNER_NAME = "فخامه مايكي"
const OWNER_NUMBER = "967734245751"

// 🧠 تنسيق الرسائل (اسمك يظهر بكل رد)
function format(text) {
    return `🤖 ${BOT_NAME}\n👑 ${OWNER_NAME}\n\n${text}`
}

// 🚫 كشف الروابط
function hasLink(text) {
    return /https?:\/\/|www\.|t\.me|instagram|youtube/.test(text)
}

// 👑 التحقق من المالك
function isOwner(sender) {
    if (!sender) return false
    return sender.split("@")[0] === OWNER_NUMBER
}

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("session")

    const sock = makeWASocket({ auth: state })

    sock.ev.on("creds.update", saveCreds)

    sock.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0]
        if (!msg.message) return

        const from = msg.key.remoteJid
        const sender = msg.key.participant || msg.key.remoteJid

        const text =
            msg.message.conversation ||
            msg.message.extendedTextMessage?.text ||
            ""

        const cmd = text.toLowerCase()

        // 🚫 منع الروابط
        if (hasLink(text)) {
            return sock.sendMessage(from, {
                text: format("🚫 ممنوع إرسال الروابط")
            })
        }

        // 📜 قائمة الأوامر
        if (cmd === "!اوامر") {
            return sock.sendMessage(from, {
                text: format(
`📜 الأوامر:

!بنج
!معلومات
.منشن_الكل
.منشن_مشرفين
.منشن_اعضاء`
                )
            })
        }

        // 🏓 بنج
        if (cmd === "!بنج") {
            return sock.sendMessage(from, {
                text: format("🏓 البوت شغال")
            })
        }

        // ℹ️ معلومات
        if (cmd === "!معلومات") {
            return sock.sendMessage(from, {
                text: format(
`👤 المطور: ${OWNER_NAME}
📞 الرقم: ${OWNER_NUMBER}`
                )
            })
        }

        // 🚫 تنصيب
        if (cmd === ".تنصيب" || cmd === ".code") {
            if (!isOwner(sender)) {
                return sock.sendMessage(from, {
                    text: format("🚫 غير مصرح لك")
                })
            }

            return sock.sendMessage(from, {
                text: format("✅ تم التحقق من المالك")
            })
        }

        // 📢 منشن الكل
        if (cmd === ".منشن_الكل") {
            const metadata = await sock.groupMetadata(from)
            const members = metadata.participants.map(p => p.id)

            return sock.sendMessage(from, {
                text: format("📢 تنويه للجميع"),
                mentions: members
            })
        }

        // 👮 منشن المشرفين
        if (cmd === ".منشن_مشرفين") {
            const metadata = await sock.groupMetadata(from)
            const admins = metadata.participants
                .filter(p => p.admin)
                .map(p => p.id)

            return sock.sendMessage(from, {
                text: format("👮 تنبيه للمشرفين"),
                mentions: admins
            })
        }

        // 👥 منشن الأعضاء
        if (cmd === ".منشن_اعضاء") {
            const metadata = await sock.groupMetadata(from)
            const users = metadata.participants
                .filter(p => !p.admin)
                .map(p => p.id)

            return sock.sendMessage(from, {
                text: format("👥 تنبيه للأعضاء"),
                mentions: users
            })
        }
    })
}

// 🚀 تشغيل البوت
startBot()

console.log(`🤖 ${BOT_NAME} شغال الآن`)
console.log(`👑 المطور: ${OWNER_NAME}`)
