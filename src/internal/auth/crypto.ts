import AES from 'crypto-js/aes'
import Utf8 from 'crypto-js/enc-utf8'
import { getConfig } from 'config'

const { encryptionKey } = getConfig()

export function encrypt(plainText: string): string {
  return AES.encrypt(plainText, encryptionKey).toString()
}

export function decrypt(cipherText: string): string {
  return AES.decrypt(cipherText, encryptionKey).toString(Utf8)
}
