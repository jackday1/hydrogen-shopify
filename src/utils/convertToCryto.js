const RATE = 0.00000016;

const convertToCrypto = (amount, currencyCode, tokenSymbol) => {
  console.log('Convert to crypto', {amount, currencyCode, tokenSymbol});

  const cryptoAmount = amount * RATE;
  return cryptoAmount;
};

export default convertToCrypto;
