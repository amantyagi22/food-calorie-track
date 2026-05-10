import axios from 'axios';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid'; // Let's install uuid

export async function downloadAndCompressImage(url: string): Promise<string> {
  const tempDir = path.join(process.cwd(), 'temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const tempFilePath = path.join(tempDir, `${uuidv4()}.jpg`);

  const response = await axios({
    url,
    method: 'GET',
    responseType: 'arraybuffer',
  });

  const buffer = Buffer.from(response.data);

  await sharp(buffer)
    .resize({ width: 1024, height: 1024, fit: 'inside' })
    .jpeg({ quality: 80 })
    .toFile(tempFilePath);

  return tempFilePath;
}

export function cleanupTempFile(filePath: string) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    // Ignore error
  }
}
