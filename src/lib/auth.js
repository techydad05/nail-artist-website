import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from './db/config.js';
import { adminUsers } from './db/schema.js';
import { eq } from 'drizzle-orm';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const SALT_ROUNDS = 12;

export async function hashPassword(password) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

export function generateToken(user) {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export async function createAdminUser(email, password, role = 'admin') {
  const passwordHash = await hashPassword(password);
  
  const newUser = await db
    .insert(adminUsers)
    .values({
      email: email.toLowerCase().trim(),
      passwordHash,
      role,
      isActive: true
    })
    .returning();
    
  return newUser[0];
}

export async function authenticateAdmin(email, password) {
  const user = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.email, email.toLowerCase().trim()))
    .limit(1);
    
  if (user.length === 0 || !user[0].isActive) {
    return null;
  }
  
  const isValid = await verifyPassword(password, user[0].passwordHash);
  if (!isValid) {
    return null;
  }
  
  // Update last login
  await db
    .update(adminUsers)
    .set({ lastLogin: new Date().toISOString() })
    .where(eq(adminUsers.id, user[0].id));
    
  return {
    id: user[0].id,
    email: user[0].email,
    role: user[0].role
  };
}

export function requireAuth(user) {
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
}

export function requireAdmin(user) {
  requireAuth(user);
  if (user.role !== 'admin' && user.role !== 'super_admin') {
    throw new Error('Admin access required');
  }
  return user;
}