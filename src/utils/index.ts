import { nanoid } from 'nanoid';

export interface RequestFile {
  originalname: string;
  buffer: Buffer;
  fieldname: string;
  mimetype: string;
}

export function getUploadedFiles(files: RequestFile[], name: string) {
  return files.filter((f) => f.fieldname === name);
}

export function isExpired(date: string | Date, intervalTime: number): boolean {
  const expiryDate = date instanceof Date ? date.getTime() + intervalTime : new Date(date).getTime() + intervalTime;
  return expiryDate < Date.now();
}

export function generateToken() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function isImage(image: { mimetype: string }, type: string = ''): boolean {
  const reg = type ? new RegExp(`(${type})`) : /(jpg|jpeg|png)/;
  return reg.test(image.mimetype);
}

export function isPng(image: { mimetype: string }) {
  return /(png)/.test(image.mimetype);
}

export function isMp4(image: { mimetype: string }) {
  return image.mimetype === 'video/mp4';
}

export function msInDays(days: number) {
  return days * 24 * 60 * 60 * 1000;
}

export function uniqueId() {
  return nanoid();
}

export function generateRandomNumber(len: number) {
  const expnt = 10 ** (len - 1);
  return Math.floor(Math.random() * (9 * expnt - 1) + expnt);
}
