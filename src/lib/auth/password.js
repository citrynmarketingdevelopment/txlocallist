import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);
const KEY_LENGTH = 64;
const SALT_BYTES = 16;

export async function hashPassword(password) {
  const salt = randomBytes(SALT_BYTES).toString("hex");
  const derivedKey = await scrypt(password, salt, KEY_LENGTH);

  return `${salt}:${Buffer.from(derivedKey).toString("hex")}`;
}

export async function verifyPassword(password, storedHash) {
  const [salt, expectedHash] = storedHash.split(":");

  if (!salt || !expectedHash) {
    return false;
  }

  const derivedKey = await scrypt(password, salt, KEY_LENGTH);
  const expectedBuffer = Buffer.from(expectedHash, "hex");
  const actualBuffer = Buffer.from(derivedKey);

  if (expectedBuffer.length !== actualBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, actualBuffer);
}
