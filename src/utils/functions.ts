export const generatePassword = (): string => {
  const alphanumeric = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let stringPassword = '';
  for (let i = 0; i < 8; i++) {
    const indiceAleatorio = Math.floor(Math.random() * alphanumeric.length);
    stringPassword += alphanumeric.charAt(indiceAleatorio);
  }
  return stringPassword;
};
