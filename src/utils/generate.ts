export const generate = () => {
  const str = "123456789QERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm";
  const length = 5;
  let res = "";

  for (let i = 0; i < length; i++) {
    res += str[Math.floor(Math.random() * str.length)];
  }
  return res;
};
