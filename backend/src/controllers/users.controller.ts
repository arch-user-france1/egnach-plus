import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';

const PatchMeSchema = z.object({
  name: z.string().min(1).optional(),
  neighborhood: z.string().min(1).optional(),
  lang: z.string().optional(),
  textScale: z.number().optional(),
  layoutOverride: z.enum(['system', 'classic', 'glass']).optional(),
  verified: z.boolean().optional(),
}).strict();

export async function patchMe(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const body = PatchMeSchema.parse(req.body);
    const user = await prisma.user.update({ where: { id: req.user.id }, data: body });
    const { id, email, name, initials, neighborhood, verified, lang, textScale, layoutOverride } = user;
    res.json({ user: { id, email, name, initials, neighborhood, verified, lang, textScale, layoutOverride } });
  } catch (err) {
    next(err);
  }
}

export async function completeOnboarding(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { lang } = z.object({ lang: z.string() }).parse(req.body);
    const user = await prisma.user.update({ where: { id: req.user.id }, data: { lang } });
    const { id, email, name, initials, neighborhood, verified, textScale, layoutOverride } = user;
    res.json({ user: { id, email, name, initials, neighborhood, verified, lang: user.lang, textScale, layoutOverride } });
  } catch (err) {
    next(err);
  }
}
