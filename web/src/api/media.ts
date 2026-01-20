import { get, post, postMultipart, del } from './client';
import { MediaAsset } from './types';

export async function getMediaAssets(): Promise<MediaAsset[]> {
  return get<MediaAsset[]>('/api/media');
}

export async function uploadMedia(file: File): Promise<MediaAsset> {
  const formData = new FormData();
  formData.append('file', file);
  return postMultipart<MediaAsset>('/api/media/upload', formData);
}

export async function generateImage(prompt: string, style: string): Promise<MediaAsset> {
  return post<MediaAsset>('/api/media/generate', {
    prompt,
    style,
  });
}

export async function deleteMedia(id: string): Promise<void> {
  await del<void>(`/api/media/${id}`);
}
