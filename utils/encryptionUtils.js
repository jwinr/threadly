import crypto from "crypto"

const encryptionKeyBase64 = process.env.ENCRYPTION_KEY

// Convert the Base64 string to a Buffer
const encryptionKey = Buffer.from(encryptionKeyBase64, "base64")

if (encryptionKey.length !== 32) {
  throw new Error("Encryption key must be 32 bytes long.")
}

export function encryptField(text) {
  try {
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv("aes-256-cbc", encryptionKey, iv)
    let encrypted = cipher.update(text, "utf8", "hex")
    encrypted += cipher.final("hex")

    // Return as a single string in the format "iv:encryptedData"
    return `${iv.toString("hex")}:${encrypted}`
  } catch (error) {
    console.error("Encryption failed:", error.message)
    throw error
  }
}

export function decryptField(encryptedData, iv) {
  try {
    console.log("Starting decryption process...")

    // If the IV is a buffer, ensure it is the correct length
    if (Buffer.isBuffer(iv)) {
    } else if (typeof iv === "string") {
      iv = Buffer.from(iv, "hex")
    } else {
      throw new TypeError("Invalid IV type. Expected a Buffer or a hex string.")
    }

    // Ensure the IV buffer is exactly 16 bytes (128 bits)
    if (iv.length === 32) {
      // If the IV buffer is mistakenly 32 bytes, convert it from hex to a 16-byte buffer
      iv = Buffer.from(iv.toString("hex").slice(0, 32), "hex")
    }

    if (iv.length !== 16) {
      throw new TypeError(
        "Invalid initialization vector length. Expected 16 bytes."
      )
    }

    // Create the decipher with the correct IV and encryption key
    const decipher = crypto.createDecipheriv("aes-256-cbc", encryptionKey, iv)

    let decrypted = decipher.update(encryptedData, "hex", "utf8")
    decrypted += decipher.final("utf8")

    return decrypted
  } catch (error) {
    console.error("Decryption failed:", error.message)
    throw error
  }
}
