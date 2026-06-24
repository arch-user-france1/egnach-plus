import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { AppError } from '../lib/errors.js';

function sortedPair(a: string, b: string): [string, string] {
  return a < b ? [a, b] : [b, a];
}

export async function listThreads(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const threads = await prisma.chatThread.findMany({
      where: { OR: [{ userAId: req.user.id }, { userBId: req.user.id }] },
      include: {
        userA: { select: { id: true, name: true, initials: true, verified: true, lang: true } },
        userB: { select: { id: true, name: true, initials: true, verified: true, lang: true } },
        listing: { select: { id: true, title: true } },
        messages: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ threads });
  } catch (err) {
    next(err);
  }
}

export async function findOrCreateThread(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { targetUserId, listingId } = z.object({
      targetUserId: z.string(),
      listingId: z.string().optional(),
    }).parse(req.body);

    const [userAId, userBId] = sortedPair(req.user.id, targetUserId);

    const thread = await prisma.chatThread.upsert({
      where: { userAId_userBId: { userAId, userBId } },
      create: { userAId, userBId, listingId },
      update: {},
      include: {
        userA: { select: { id: true, name: true, initials: true, verified: true, lang: true } },
        userB: { select: { id: true, name: true, initials: true, verified: true, lang: true } },
        listing: { select: { id: true, title: true } },
      },
    });
    res.json({ thread });
  } catch (err) {
    next(err);
  }
}

export async function listMessages(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const thread = await prisma.chatThread.findUniqueOrThrow({ where: { id: req.params.id } });
    if (thread.userAId !== req.user.id && thread.userBId !== req.user.id) {
      return next(new AppError(403, 'Forbidden'));
    }
    const messages = await prisma.message.findMany({
      where: { threadId: req.params.id },
      orderBy: { createdAt: 'asc' },
    });
    res.json({ messages });
  } catch (err) {
    next(err);
  }
}

export async function sendMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const body = z.object({
      text: z.string().min(1),
      translation: z.string().optional(),
      translatedFrom: z.string().optional(),
      translatedTo: z.string().optional(),
    }).parse(req.body);

    const thread = await prisma.chatThread.findUniqueOrThrow({ where: { id: req.params.id } });
    if (thread.userAId !== req.user.id && thread.userBId !== req.user.id) {
      return next(new AppError(403, 'Forbidden'));
    }

    const message = await prisma.message.create({
      data: { ...body, threadId: req.params.id, senderId: req.user.id },
    });
    res.status(201).json({ message });
  } catch (err) {
    next(err);
  }
}
