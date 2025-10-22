export const getApiBaseUrl = (): string => {
  return process.env.EXPO_PUBLIC_API_URL ?? '';
};
