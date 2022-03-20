const DUTCH_INCREMENT = 25;

const calculateCurrentIncrement = (currentTime, startTime, finishTime) => {
  return Math.floor(
    ((currentTime - startTime) / (finishTime - startTime)) * DUTCH_INCREMENT
  );
};

const calculateCurrentPrice = (
  startingPrice,
  reservePrice,
  currentIncrement
) => {
  return (
    startingPrice +
    ((reservePrice - startingPrice) / DUTCH_INCREMENT) * currentIncrement
  );
};

export { calculateCurrentPrice, calculateCurrentIncrement };
