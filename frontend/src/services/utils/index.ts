export const handleResponseErrorMessage = (error: any) => {
  return error.response?.data?.meta?.errors[0]?.error || "Erro Desconhecido";
};
