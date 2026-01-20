import * as client from './client';
import { getMediaAssets, uploadMedia, generateImage, deleteMedia } from './media';

jest.mock('./client');

describe('media API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getMediaAssets', () => {
    it('fetches media assets', async () => {
      const mockAssets = [
        {
          id: 'media-1',
          name: 'Test Image',
          url: 'https://example.com/image.jpg',
          type: 'image' as const,
          size: '2.4 MB',
          createdAt: '2024-01-01T00:00:00Z',
        },
      ];

      (client.get as jest.Mock).mockResolvedValue(mockAssets);

      const result = await getMediaAssets();

      expect(client.get).toHaveBeenCalledWith('/api/media');
      expect(result).toEqual(mockAssets);
    });
  });

  describe('uploadMedia', () => {
    it('uploads media file', async () => {
      const mockFile = new File(['image'], 'test.jpg', { type: 'image/jpeg' });
      const mockAsset = {
        id: 'media-2',
        name: 'test.jpg',
        url: 'https://example.com/uploaded.jpg',
        type: 'image' as const,
        size: '1.5 MB',
        createdAt: '2024-01-01T00:00:00Z',
      };

      (client.postMultipart as jest.Mock).mockResolvedValue(mockAsset);

      const result = await uploadMedia(mockFile);

      expect(client.postMultipart).toHaveBeenCalledWith('/api/media/upload', expect.any(FormData));
      expect(result).toEqual(mockAsset);
    });
  });

  describe('generateImage', () => {
    it('generates image from prompt', async () => {
      const mockAsset = {
        id: 'media-3',
        name: 'Generated Image',
        url: 'https://example.com/generated.jpg',
        type: 'image' as const,
        size: '2.8 MB',
        createdAt: '2024-01-01T00:00:00Z',
      };

      (client.post as jest.Mock).mockResolvedValue(mockAsset);

      const result = await generateImage('Test prompt', 'professional');

      expect(client.post).toHaveBeenCalledWith('/api/media/generate', {
        prompt: 'Test prompt',
        style: 'professional',
      });
      expect(result).toEqual(mockAsset);
    });
  });

  describe('deleteMedia', () => {
    it('deletes media asset', async () => {
      (client.del as jest.Mock).mockResolvedValue(undefined);

      await deleteMedia('media-1');

      expect(client.del).toHaveBeenCalledWith('/api/media/media-1');
    });
  });
});
