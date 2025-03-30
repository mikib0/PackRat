import { createHash, randomBytes } from 'crypto';
import { sign, verify } from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';

// Generate a random token
export function generateToken(length = 32): string {
  return randomBytes(length).toString('hex');
}

// Hash a password using bcrypt
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

// Verify a password against a hash
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

// Generate a refresh token
export function generateRefreshToken(): string {
  return randomBytes(40).toString("hex")
}

// Generate a JWT token
export function generateJWT(payload: any, expiresIn = '7d'): string {
  return sign(payload, process.env.JWT_SECRET!, { expiresIn });
}

// Verify a JWT token
export function verifyJWT(token: string): any {
  try {
    return verify(token, process.env.JWT_SECRET!);
  } catch (error) {
    return null;
  }
}

// Generate a random numeric verification code
export function generateVerificationCode(length = 6): string {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
}

// Validate password strength
export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }

  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }

  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }

  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }

  return { valid: true };
}

// Validate email format
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
