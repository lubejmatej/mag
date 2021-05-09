import { BlobItem, BlobPrefix } from '@azure/storage-blob';

export type HierarchyBlob =
  | ({ kind: 'prefix' } & BlobPrefix)
  | ({ kind: 'blob' } & BlobItem);
