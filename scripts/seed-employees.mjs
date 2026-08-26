/* Creates or updates ESS employee accounts with scrypt-hashed passwords.

   Hashes are never committed — this reads plaintext from the command line or
   from SEED_EMPLOYEES, hashes it here, and writes only the hash.

   Usage:
     npm run seed:employees -- NIK-0001 "Idris" "Staff Tiket / Gate" <password>
     npm run seed:employees            # uses the SEED_EMPLOYEES env var

   SEED_EMPLOYEES format (semicolon between accounts, pipe between fields):
     NIK-0001|Idris|Staff Tiket / Gate|s3cret-one;NIK-0002|kak ami|Supervisor|s3cret-two
*/
import { createClient } from '@supabase/supabase-js';
import { hashPassword } from '../src/lib/password.js';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY first (see .env.example).');
  process.exit(1);
}

const args = process.argv.slice(2);
const rows = args.length >= 4
  ? [args.slice(0, 4)]
  : (process.env.SEED_EMPLOYEES ?? '')
      .split(';')
      .map(s => s.trim())
      .filter(Boolean)
      .map(s => s.split('|').map(f => f.trim()));

if (rows.length === 0) {
  console.error('Nothing to seed. Pass arguments or set SEED_EMPLOYEES — see the header of this file.');
  process.exit(1);
}

const db = createClient(url, key, { auth: { persistSession: false } });

for (const [nik, full_name, role, password] of rows) {
  if (!nik || !full_name || !role || !password) {
    console.error(`Skipping malformed entry: ${JSON.stringify([nik, full_name, role])}`);
    process.exitCode = 1;
    continue;
  }

  const password_hash = await hashPassword(password);
  const { error } = await db
    .from('employees')
    .upsert({ nik: nik.toUpperCase(), full_name, role, password_hash, active: true },
            { onConflict: 'nik' });

  if (error) {
    console.error(`FAILED ${nik}: ${error.message}`);
    process.exitCode = 1;
  } else {
    console.log(`ok  ${nik}  ${full_name} (${role})`);
  }
}
