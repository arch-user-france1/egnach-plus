import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { AppError } from '../lib/errors.js';

const ListingSchema = z.object({
  title: z.string().min(1),
  cat: z.enum(['Leihen', 'Dienste', 'Tausch', 'Jobs']),
  neighborhood: z.string().min(1),
  lat: z.number().optional(),
  lng: z.number().optional(),
  price: z.string().min(1),
  priceWeek: z.string().optional(),
  tone: z.enum(['sand', 'lake', 'slate', 'moss', 'rose']).default('sand'),
  available: z.string().min(1),
  handover: z.string().min(1),
  deposit: z.string().optional(),
  languages: z.string().min(1),
  description: z.string().min(1),
});

export async function listListings(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { cat, neighborhood, q } = req.query as Record<string, string | undefined>;
    const listings = await prisma.listing.findMany({
      where: {
        ...(cat ? { cat: cat as any } : {}),
        ...(neighborhood ? { neighborhood } : {}),
        ...(q ? { title: { contains: q, mode: 'insensitive' } } : {}),
      },
      include: { owner: { select: { name: true, initials: true, verified: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ listings });
  } catch (err) {
    next(err);
  }
}

export async function createListing(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const body = ListingSchema.parse(req.body);
    const listing = await prisma.listing.create({
      data: { ...body, ownerId: req.user.id },
      include: { owner: { select: { name: true, initials: true, verified: true } } },
    });
    res.status(201).json({ listing });
  } catch (err) {
    next(err);
  }
}

export async function getListing(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const listing = await prisma.listing.findUniqueOrThrow({
      where: { id: req.params.id },
      include: { owner: { select: { name: true, initials: true, verified: true } } },
    });
    res.json({ listing });
  } catch (err) {
    next(err);
  }
}

export async function updateListing(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const existing = await prisma.listing.findUniqueOrThrow({ where: { id: req.params.id } });
    if (existing.ownerId !== req.user.id) return next(new AppError(403, 'Forbidden'));
    const body = ListingSchema.partial().parse(req.body);
    const listing = await prisma.listing.update({
      where: { id: req.params.id },
      data: body,
      include: { owner: { select: { name: true, initials: true, verified: true } } },
    });
    res.json({ listing });
  } catch (err) {
    next(err);
  }
}

export async function deleteListing(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const existing = await prisma.listing.findUniqueOrThrow({ where: { id: req.params.id } });
    if (existing.ownerId !== req.user.id) return next(new AppError(403, 'Forbidden'));
    await prisma.listing.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function toggleFavorite(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const listingId = req.params.id;
    const userId = req.user.id;
    const existing = await prisma.favorite.findUnique({ where: { userId_listingId: { userId, listingId } } });
    if (existing) {
      await prisma.favorite.delete({ where: { userId_listingId: { userId, listingId } } });
      res.json({ favorited: false });
    } else {
      await prisma.favorite.create({ data: { userId, listingId } });
      res.json({ favorited: true });
    }
  } catch (err) {
    next(err);
  }
}

export async function myFavorites(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const favorites = await prisma.favorite.findMany({ where: { userId: req.user.id } });
    res.json({ favoriteIds: favorites.map(f => f.listingId) });
  } catch (err) {
    next(err);
  }
}
