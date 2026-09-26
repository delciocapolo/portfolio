import { QueryClient } from "@tanstack/react-query";

export function getContext() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 30, // 30min — não refetch em background desnecessariamente
        gcTime: 1000 * 60 * 60, // 1h — mantém no cache mesmo sem componentes a usar
        retry: 2, // 2 tentativas em caso de falha (default é 3, excessivo)
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // backoff exponencial
        refetchOnWindowFocus: false, // evita refetch ao voltar ao tab — dados não mudam assim tanto
        refetchOnReconnect: true, // mas ao reconectar faz sentido actualizar
      },
      mutations: { retry: 0 },
    },
  });

  return { queryClient };
}

export default function TanstackQueryProvider() {}
