import { BlobItem, BlobServiceClient } from '@azure/storage-blob';
import {
  BLOB_URL,
  BLOB_READ_SAS,
  BLOB_CONTAINER_NAME,
} from '../constants/azure-blob-storage-constants';
import INFO_FILE_CONTENTS_CACHE from '../mocks/info-file-contents';
import ROOT_DIRECTORY_CACHE from '../mocks/root-directory';
import RUN_FILE_CONTENTS_CACHE from '../mocks/run-file-contents';
import { HierarchyBlob } from '../types';

export abstract class AzureBlobStorage {
  static getBlobServiceClient(
    blobUrl: string = BLOB_URL,
    blobSas: string = BLOB_READ_SAS
  ): BlobServiceClient {
    return new BlobServiceClient(`${blobUrl}${blobSas}`);
  }

  static getContainerClient() {
    return AzureBlobStorage.getBlobServiceClient().getContainerClient(
      BLOB_CONTAINER_NAME
    );
  }

  static async getAllHierarchyBlobs(prefix?: string): Promise<HierarchyBlob[]> {
    const containerClient = AzureBlobStorage.getContainerClient();
    const iter = containerClient.listBlobsByHierarchy(
      '/',
      prefix ? { prefix } : {}
    );
    const blobs: HierarchyBlob[] = [];
    let blobIterator = await iter.next();
    while (!blobIterator.done) {
      const blob = blobIterator.value;
      blobs.push(blob);
      blobIterator = await iter.next();
    }
    return blobs;
  }

  static async getInfoFiles(fromCache = true): Promise<BlobItem[]> {
    if (fromCache) {
      return ROOT_DIRECTORY_CACHE.filter(
        (b) => b.kind === 'blob'
      ) as BlobItem[];
    }
    const blobs = await this.getAllHierarchyBlobs();
    return blobs.filter((b) => b.kind === 'blob') as BlobItem[];
  }

  static getDownloadUrl(
    filePath: string,
    blobUrl: string = BLOB_URL,
    blobSas: string = BLOB_READ_SAS,
    blobContainer: string = BLOB_CONTAINER_NAME
  ): string {
    const cdatFileName = filePath.replace('.dat', '.cdat');
    return `${blobUrl}/${blobContainer}/${cdatFileName}${blobSas}`;
  }

  static async downloadFile(
    filePath: string,
    fromCache = true
  ): Promise<string> {
    if (fromCache) {
      return INFO_FILE_CONTENTS_CACHE;
    }

    const blobFile = await this.getContainerClient()
      .getBlobClient(filePath)
      .download();
    const blobBody = await blobFile.blobBody;
    return await blobBody!.text();
  }

  static async downloadRunFile(
    filePath: string,
    fromCache = true
  ): Promise<string> {
    if (fromCache) {
      return RUN_FILE_CONTENTS_CACHE;
    }

    // check if .cdat is available
    if (filePath.indexOf('/') >= 0) {
      const dir = filePath.split('/')[0];
      const allHierarchyBlobs = await this.getAllHierarchyBlobs(`${dir}/`);
      const blobItems = allHierarchyBlobs.filter(
        (b) => b.kind === 'blob'
      ) as BlobItem[];

      const cdatFileName = filePath.replace('.dat', '.cdat');
      const cdatBlob = blobItems.find(({ name }) => name === cdatFileName);

      if (cdatBlob) {
        return AzureBlobStorage.downloadFile(cdatBlob.name, fromCache);
      }
    }

    return AzureBlobStorage.downloadFile(filePath, fromCache);
  }
}
