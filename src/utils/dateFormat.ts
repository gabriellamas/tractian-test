export const dateFormat = (dateString: string) => {
  const date = new Date(dateString);
  const localDate = new Date(
    date.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" })
  );

  return localDate.toLocaleDateString("pt-BR");
};
