// Example: 16 Feb 2022 12:30:00 GMT
const dateTimeValidator = (input) => {
  const dateTime = /^\d{1,2} \w{3} \d{4} \d{2}:\d{2}:\d{2} \w{3}$/;
  return dateTime.test(input);
};

module.exports = dateTimeValidator;
