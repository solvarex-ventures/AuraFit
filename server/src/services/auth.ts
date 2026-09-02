import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../db.js';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'trainer';
  discipline: string | null;
  health_screening_completed_at: string | null;
}

function jwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not set — add any long random string to server/.env before enabling auth.');
  }
  return secret;
}

export function signToken(user: AuthUser): string {
  return jwt.sign({ sub: user.id, role: user.role }, jwtSecret(), { expiresIn: '30d' });
}

export function verifyToken(token: string): { sub: string; role: string } {
  return jwt.verify(token, jwtSecret()) as { sub: string; role: string };
}

export async function createUser(params: {
  name: string;
  email: string;
  password: string;
  role: 'client' | 'trainer';
}): Promise<AuthUser> {
  const existing = await query('select id from users where email = $1', [params.email.toLowerCase()]);
  if (existing.rowCount) {
    throw new Error('An account with this email already exists.');
  }

  const passwordHash = await bcrypt.hash(params.password, 10);
  const result = await query<AuthUser>(
    `insert into users (name, email, password_hash, role)
     values ($1, $2, $3, $4)
     returning id, name, email, role, discipline, health_screening_completed_at`,
    [params.name, params.email.toLowerCase(), passwordHash, params.role]
  );
  return result.rows[0];
}

export async function verifyLogin(email: string, password: string): Promise<AuthUser> {
  const result = await query<AuthUser & { password_hash: string }>(
    'select id, name, email, role, discipline, health_screening_completed_at, password_hash from users where email = $1',
    [email.toLowerCase()]
  );

  const row = result.rows[0];
  if (!row) throw new Error('Invalid email or password.');

  const ok = await bcrypt.compare(password, row.password_hash);
  if (!ok) throw new Error('Invalid email or password.');

  const { password_hash, ...user } = row;
  return user;
}

export async function getUserById(id: string): Promise<AuthUser | null> {
  const result = await query<AuthUser>(
    'select id, name, email, role, discipline, health_screening_completed_at from users where id = $1',
    [id]
  );
  return result.rows[0] ?? null;
}
