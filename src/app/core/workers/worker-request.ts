export function workerRequest<TInput, TOutput>(
  worker: Worker,
  data: TInput,
  ): Promise<TOutput> {
    return new Promise((resolve, reject) => {
      const handleMessage = (event: MessageEvent) => {
        cleanup();
        resolve(event.data);
        worker.terminate();
      };

      const handleError = (error: ErrorEvent) => {
        cleanup();
        reject(error);
        worker.terminate();
      };

      const cleanup = () => {
        worker.removeEventListener('message', handleMessage);
        worker.removeEventListener('error', handleError);
      };

      worker.addEventListener('message', handleMessage);
      worker.addEventListener('error', handleError);

      worker.postMessage(data);
    });
}
