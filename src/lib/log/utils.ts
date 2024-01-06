export const formatLoggerMessage = (PATH: string, message: string, stage?: string) => {
  return `[${PATH}${stage ? `:${stage}` : ''}] ${message}`;
};
