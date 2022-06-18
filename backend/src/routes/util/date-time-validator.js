// Example: Wed, 16 Feb 2022 12:30:00 GMT
const DATE_TIME = /^\w{3}, \d{1,2} \w{3} \d{4} \d{2}:\d{2}:\d{2} \w{3}$/;

const dateTimeValidator = (input, _meta) => {
  return DATE_TIME.test(input);
};

module.exports = dateTimeValidator;
