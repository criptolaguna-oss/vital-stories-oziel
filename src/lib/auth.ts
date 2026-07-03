// Sistema simple de autenticación basado en cookies para el panel admin
// En producción usar variables de entorno con clave fuerte

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'oziel';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'vital2026';
const SESSION_SECRET = process.env.SESSION_SECRET || 'vital-stories-secret-key-2026';

// Codificación/decodificación Base64URL
function b64urlEncode(str: string): string {
  return Buffer.from(str).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function b64urlDecode(str: string): string {
  let s = str.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  return Buffer.from(s, 'base64').toString('utf-8');
}

// HMAC-SHA256 simple usando Node.js crypto
import crypto from 'crypto';

function sign(payload: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(payload).digest('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

export function createToken(username: string): string {
  const header = b64urlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = b64urlEncode(JSON.stringify({ username, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 }));
  const signature = sign(`${header}.${payload}`, SESSION_SECRET);
  return `${header}.${payload}.${signature}`;
}

export function verifyToken(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const [header, body, signature] = parts;
    const expectedSig = sign(`${header}.${body}`, SESSION_SECRET);
    if (signature !== expectedSig) return false;
    const payload = JSON.parse(b64urlDecode(body));
    if (payload.exp && payload.exp < Date.now()) return false;
    return true;
  } catch {
    return false;
  }
}

export function validateCredentials(username: string, password: string): boolean {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}
