import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';

/**
 * Shrinks a captured photo before it is sent for AI analysis. Full-resolution
 * camera frames are several MB of base64; 1024 px on the long edge is plenty
 * for food/physique recognition and keeps uploads fast and cheap.
 * Returns base64 without the `data:image/jpeg;base64,` prefix.
 */
export async function prepareForAnalysis(uri: string, width: number, height: number, maxEdge = 1024): Promise<string | null> {
  const ctx = ImageManipulator.manipulate(uri);
  if (Math.max(width, height) > maxEdge) {
    ctx.resize(width >= height ? { width: maxEdge } : { height: maxEdge });
  }
  const image = await ctx.renderAsync();
  const result = await image.saveAsync({ base64: true, compress: 0.7, format: SaveFormat.JPEG });
  return result.base64 ?? null;
}
