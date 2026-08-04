/* Small helpers shared by the API endpoints. */

function json(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...headers },
  });
}

/**
 * Parse a JSON body with a size cap. An unbounded body is a free memory-DoS on
 * an unauthenticated endpoint, so this rejects anything oversized before
 * parsing.
 * @param {Request} request
 * @param {number} maxBytes
 */
async function readJson(request, maxBytes = 8 * 1024) {
  const declared = Number(request.headers.get('content-length'));
  if (Number.isFinite(declared) && declared > maxBytes) throw new HttpError(413, 'Body terlalu besar.');

  const text = await request.text();
  if (text.length > maxBytes) throw new HttpError(413, 'Body terlalu besar.');

  try {
    const parsed = JSON.parse(text || '{}');
    if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new HttpError(400, 'Body harus berupa objek JSON.');
    }
    return parsed;
  } catch (err) {
    if (err instanceof HttpError) throw err;
    throw new HttpError(400, 'JSON tidak valid.');
  }
}

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

/** Wraps a handler so thrown HttpErrors become responses and nothing else leaks. */
function handler(fn) {
  return async ctx => {
    try {
      return await fn(ctx);
    } catch (err) {
      if (err instanceof HttpError) return json({ error: err.message }, err.status);
      console.error('[api] unhandled:', err);
      return json({ error: 'Terjadi kesalahan pada server.' }, 500);
    }
  };
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function normaliseEmail(value) {
  if (typeof value !== 'string') throw new HttpError(400, 'Email wajib diisi.');
  const email = value.trim().toLowerCase();
  if (email.length > 254 || !EMAIL.test(email)) throw new HttpError(400, 'Format email tidak valid.');
  return email;
}

function normaliseName(value) {
  if (typeof value !== 'string') throw new HttpError(400, 'Nama wajib diisi.');
  const name = value.trim().replace(/\s+/g, ' ');
  if (name.length < 3) throw new HttpError(400, 'Nama minimal 3 karakter.');
  if (name.length > 80) throw new HttpError(400, 'Nama maksimal 80 karakter.');
  return name;
}

export { HttpError as H, normaliseName as a, handler as h, json as j, normaliseEmail as n, readJson as r };
