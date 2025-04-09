'use client';

import {fetchWithCsrf} from '@/utils/fetchWithCsrf';

interface FavoritesQuery {
  userId: string;
  limit?: number;
  offset?: number;
}

interface FavoritesMutation {
  userId: string;
  colorVariantId: number;
}

export async function listFavorites<T>({
  userId,
  limit,
  offset,
}: FavoritesQuery): Promise<T[]> {
  const params = new URLSearchParams({id: userId});
  if (typeof limit === 'number') {
    params.set('limit', String(limit));
  }
  if (typeof offset === 'number') {
    params.set('offset', String(offset));
  }

  const response = await fetch(`/api/favorites?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch favorites');
  }

  return (await response.json()) as T[];
}

export async function addFavorite({
  userId,
  colorVariantId,
}: FavoritesMutation): Promise<void> {
  const response = await fetchWithCsrf('/api/favorites', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({userId, colorVariantId}),
  });

  if (!response.ok) {
    throw new Error('Failed to add favorite');
  }
}

export async function removeFavorite({
  userId,
  colorVariantId,
}: FavoritesMutation): Promise<void> {
  const response = await fetchWithCsrf('/api/favorites', {
    method: 'DELETE',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({userId, colorVariantId}),
  });

  if (!response.ok) {
    throw new Error('Failed to remove favorite');
  }
}
