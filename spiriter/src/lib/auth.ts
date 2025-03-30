import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export function verifyAuthHeader(request: NextRequest) {
  let token: string | undefined;

  // Check for Authorization header
  const header = request.headers.get('authorization');
  if (header && header.startsWith('Bearer ')) {
    token = header.split(' ')[1];
  } else {
    // Fallback: get token from cookies
    token = request.cookies.get('token')?.value;
  }

  if (!token) {
    throw new Error('Unauthorized: No token provided');
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('Server error: JWT_SECRET is missing');
  }

  try {
    const decoded = jwt.verify(token, secret);
    return decoded; // Expected to include { id, isAdmin }
  } catch (error) {
    console.log(error)
    throw new Error('Unauthorized: Invalid token');
  }
}