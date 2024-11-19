import { v4 as uuidv4 } from 'uuid';

export function getUniqueId() {
  return uuidv4();
}

export function rounded(num: string | number) {
  const value = typeof num === 'string' ? parseFloat(num) : num;
  return parseFloat(value.toFixed(2));
}

export function sleep(duration: number): Promise<any> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), duration);
  });
}
