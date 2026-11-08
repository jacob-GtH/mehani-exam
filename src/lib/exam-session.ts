import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

const secret = () => {
  const value = process.env.EXAM_SESSION_SECRET || process.env.ADMIN_SECRET;
  if (!value || value.length < 32) throw new Error("EXAM_SESSION_SECRET must contain at least 32 characters");
  return Buffer.from(value).subarray(0, 32);
};

export function sealSession(value: unknown) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", secret(), iv);
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify(value), "utf8"), cipher.final()]);
  return { ciphertext: ciphertext.toString("base64url"), iv: iv.toString("base64url"), tag: cipher.getAuthTag().toString("base64url") };
}

export function openSession<T>(record: { ciphertext: string; iv: string; tag: string }): T {
  const decipher = createDecipheriv("aes-256-gcm", secret(), Buffer.from(record.iv, "base64url"));
  decipher.setAuthTag(Buffer.from(record.tag, "base64url"));
  const plain = Buffer.concat([decipher.update(Buffer.from(record.ciphertext, "base64url")), decipher.final()]);
  return JSON.parse(plain.toString("utf8")) as T;
}
