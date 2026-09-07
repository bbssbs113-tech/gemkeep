export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function pTimeout<T>(promise: Promise<T>, ms: number, fallback?: T): Promise<T> {
  let timer: any;
  const timeoutPromise = new Promise<T>((resolve, reject) => {
    timer = setTimeout(() => {
      if (fallback !== undefined) resolve(fallback);
      else reject(new Error('Timeout'));
    }, ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timer));
}
