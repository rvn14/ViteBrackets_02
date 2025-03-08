import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export function verifyAuthHeader(request: NextRequest) {
  const header = request.headers.get('authorization');

  if (!header || !header.startsWith('Bearer ')) {
    throw new Error('Unauthorized: No token provided');
  }

  const token = header.split(' ')[1];
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('Server error: JWT_SECRET is missing');
  }

  try {
    const decoded = jwt.verify(token, secret);
    return decoded; // Now includes { id, isAdmin }
  } catch (error) {
    throw new Error('Unauthorized: Invalid token');
  }
}
