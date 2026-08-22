import { useQuery } from "@tanstack/react-query";
import { collectionsApi } from "@lib/api/collections";

export const COLLECTION_KEYS = {
  all: () => ["collections"] as const,
  lists: () => ["collections", "list"] as const,
  list: (queryParams?: Record<string, unknown>) =>
    ["collections", "list", queryParams] as const,
  detail: (id: string) => ["collections", "detail", id] as const,
  byHandle: (handle: string) => ["collections", "handle", handle] as const,
};

export const useCollections = (queryParams?: Record<string, unknown>) => {
  return useQuery({
    queryKey: COLLECTION_KEYS.list(queryParams),
    queryFn: () => collectionsApi.list(queryParams),
  });
};

export const useCollection = (id: string) => {
  return useQuery({
    queryKey: COLLECTION_KEYS.detail(id),
    queryFn: () => collectionsApi.retrieve(id),
    enabled: !!id,
  });
};

export const useCollectionByHandle = (handle: string) => {
  return useQuery({
    queryKey: COLLECTION_KEYS.byHandle(handle),
    queryFn: () => collectionsApi.getByHandle(handle),
    enabled: !!handle,
  });
};
