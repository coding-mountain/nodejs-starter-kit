export enum SanitizeType {
  trim,
  rtrim,
  uppercase,
  lowerCase,
}

export function sanitize<T extends string>(value: any, options: SanitizeType[] = []): T {
  let returnValue = String(value);
  for (const option of options) {
    if (option === SanitizeType.trim) {
      returnValue = returnValue.trim();
    } else if (option === SanitizeType.rtrim) {
      returnValue = returnValue.trimEnd();
    } else if (option === SanitizeType.uppercase) {
      returnValue = returnValue.toUpperCase();
    } else if (option === SanitizeType.lowerCase) {
      returnValue = returnValue.toLowerCase();
    }
  }
  return returnValue as T;
}

export function sanitizeDate(value: any) {
  if (!value) {
    return undefined;
  }
  return new Date(value);
}

export function sanitizeInt(value: any) {
  if (!value) {
    return undefined;
  }
  return parseInt(value, 10);
}
