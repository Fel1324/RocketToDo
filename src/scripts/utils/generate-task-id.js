export const generateTaskId = () => {
  const timestamp = new Date().getTime().toString(36);
  const randomValue = Math.random().toString(36).substring(2, 9);

  return `${timestamp}-${randomValue}`;
}
