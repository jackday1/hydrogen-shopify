const convertToCrypto = (amount, currencyCode, tokenSymbol) => {
  console.log('Convert to crypto', {amount, currencyCode, tokenSymbol});

  const cryptoAmount = amount * 0.00016;
  return cryptoAmount;
};

export default convertToCrypto;
