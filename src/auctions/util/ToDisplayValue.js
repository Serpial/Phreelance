const ToDisplayValue = (valueNumber) => {
  // source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
  const numberFormat = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  });

  return numberFormat.format(valueNumber);
};

export default ToDisplayValue;