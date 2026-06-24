import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { hashPassword, verifyPassword } from '../lib/password.js';
import { signToken } from '../lib/jwt.js';
import { AppError } from '../lib/errors.js';

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
  neighborhood: z.string().min(1),
  lang: z.string().default('de'),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

function userPublic(user: {
  id: string; email: string; name: string; initials: string;
  neighborhood: string; verified: boolean; lang: string;
  textScale: number; layoutOverride: string;
}) {
  const { id, email, name, initials, neighborhood, verified, lang, textScale, layoutOverride } = user;
  return { id, email, name, initials, neighborhood, verified, lang, textScale, layoutOverride };
}

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const body = RegisterSchema.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email: body.email } });
    if (existing) return next(new AppError(409, 'Email already registered'));

    const parts = body.name.trim().split(' ');
    const initials = (parts[0][0] + (parts.at(-1)?.[0] ?? '')).toUpperCase();

    const user = await prisma.user.create({
      data: {
        email: body.email,
        passwordHash: await hashPassword(body.password),
        name: body.name,
        initials,
        neighborhood: body.neighborhood,
        lang: body.lang,
      },
    });

    res.status(201).json({ token: signToken({ id: user.id, email: user.email }), user: userPublic(user) });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const body = LoginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user || !(await verifyPassword(body.password, user.passwordHash))) {
      return next(new AppError(401, 'Invalid email or password'));
    }
    res.json({ token: signToken({ id: user.id, email: user.email }), user: userPublic(user) });
  } catch (err) {
    next(err);
  }
}

export async function me(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await prisma.user.findUniqueOrThrow({ where: { id: req.user.id } });
    res.json({ user: userPublic(user) });
  } catch (err) {
    next(err);
  }
}
