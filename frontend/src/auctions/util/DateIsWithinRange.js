const DateIsWithinRange = (creation, start, finish) => {
  const day = 86400000;
  const threeMonths = 8035200000;
  const year = 31622400000;

  const message = [];
  const startIsWithinThreeMonths =
    start.getTime() < creation.getTime() + threeMonths;
  if (!startIsWithinThreeMonths) {
    message.push("The start date should be within three months of today");
  }

  const startIsNotBeforeCreation = start.getTime() >= creation;
  if (!startIsNotBeforeCreation) {
    message.push("The start date should be after the current time.");
  }

  const auctionLengthIsAtLeastADay = start.getTime() + day < finish.getTime();
  if (!auctionLengthIsAtLeastADay) {
    message.push(
      "You must make sure you auction is live for more than 24 hours to allow bidders to participate."
    );
  }

  const finishTimeIsWithinAYear = finish.getTime() < start.getTime() + year;
  if (!finishTimeIsWithinAYear) {
    message.push("The auction should be over within a year.");
  }

  return {
    isValid: message.length < 1,
    message,
  };
};

export default DateIsWithinRange;