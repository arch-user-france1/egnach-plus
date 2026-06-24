import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';

const EventSchema = z.object({
  title: z.string().min(1),
  date: z.string().min(1),
  dateShort: z.string().min(1),
  time: z.string().min(1),
  location: z.string().min(1),
  address: z.string().min(1),
  cats: z.array(z.string()),
  tone: z.enum(['sand', 'lake', 'slate', 'moss', 'rose']).default('lake'),
  free: z.boolean().default(true),
  languages: z.string().min(1),
  description: z.string().min(1),
  organizer: z.string().min(1),
  month: z.string().min(1),
  day: z.number().int(),
});

export async function listEvents(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { cat, month } = req.query as Record<string, string | undefined>;
    const events = await prisma.event.findMany({
      where: {
        ...(cat ? { cats: { has: cat } } : {}),
        ...(month ? { month } : {}),
      },
      include: { creator: { select: { name: true, initials: true } } },
      orderBy: [{ month: 'asc' }, { day: 'asc' }],
    });
    res.json({ events });
  } catch (err) {
    next(err);
  }
}

export async function createEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const body = EventSchema.parse(req.body);
    const event = await prisma.event.create({
      data: { ...body, creatorId: req.user.id },
      include: { creator: { select: { name: true, initials: true } } },
    });
    res.status(201).json({ event });
  } catch (err) {
    next(err);
  }
}

export async function getEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const event = await prisma.event.findUniqueOrThrow({
      where: { id: req.params.id },
      include: { creator: { select: { name: true, initials: true } } },
    });
    res.json({ event });
  } catch (err) {
    next(err);
  }
}

export async function upsertRsvp(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { status } = z.object({ status: z.enum(['accepted', 'declined']) }).parse(req.body);
    const rsvp = await prisma.eventRsvp.upsert({
      where: { userId_eventId: { userId: req.user.id, eventId: req.params.id } },
      create: { userId: req.user.id, eventId: req.params.id, status },
      update: { status },
    });
    res.json({ rsvp });
  } catch (err) {
    next(err);
  }
}

export async function deleteRsvp(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await prisma.eventRsvp.deleteMany({ where: { userId: req.user.id, eventId: req.params.id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function myRsvps(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const rsvps = await prisma.eventRsvp.findMany({ where: { userId: req.user.id } });
    res.json({ rsvps: rsvps.map(r => ({ eventId: r.eventId, status: r.status })) });
  } catch (err) {
    next(err);
  }
}
