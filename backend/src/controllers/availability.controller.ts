import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';

const SlotSchema = z.object({
  from: z.string(),
  to: z.string(),
  label: z.string(),
  recurring: z.boolean(),
  booked: z.boolean(),
});

export async function myAvailability(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const rows = await prisma.availability.findMany({ where: { userId: req.user.id } });
    const availability: Record<string, unknown[]> = {};
    for (const row of rows) availability[row.date] = row.slots as unknown[];
    res.json({ availability });
  } catch (err) {
    next(err);
  }
}

export async function saveAvailability(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { date } = req.params;
    const slots = z.array(SlotSchema).parse(req.body.slots);
    const row = await prisma.availability.upsert({
      where: { userId_date: { userId: req.user.id, date } },
      create: { userId: req.user.id, date, slots },
      update: { slots },
    });
    res.json({ date: row.date, slots: row.slots });
  } catch (err) {
    next(err);
  }
}

export async function userAvailability(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const rows = await prisma.availability.findMany({ where: { userId: req.params.userId } });
    const availability: Record<string, unknown[]> = {};
    for (const row of rows) availability[row.date] = row.slots as unknown[];
    res.json({ availability });
  } catch (err) {
    next(err);
  }
}
