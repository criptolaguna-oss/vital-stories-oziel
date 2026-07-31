// Sistema de autenticación basado en cookies para el panel admin
// Credenciales por defecto SIEMPRE disponibles (oziel / vital2026)

const DEFAULT_USERNAME = 'oziel';
const DEFAULT_PASSWORD = 'vital2026';
const DEFAULT_SECRET = 'vital-stories-oziel-default-secret-2026';

// Las variables de entorno pueden sobreescribir en producción (opcional)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || DEFAULT_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || DEFAULT_PASSWORD;
const SESSION_SECRET = process.env.SESSION_SECRET || DEFAULT_SECRET;

// Codificación/decodificación Base64URL
function b64urlEncode(str: string): string {
  return Buffer.from(str).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function b64urlDecode(str: string): string {
  let s = str.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  return Buffer.from(s, 'base64').toString('utf-8');
}

// HMAC-SHA256 usando Node.js crypto
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
  // Aceptar credenciales por defecto O las de variables de entorno
  const isDefault = username === DEFAULT_USERNAME && password === DEFAULT_PASSWORD;
  const isEnv = username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
  return isDefault || isEnv;
}
