export const isValidEmail = (email: string) => {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line no-useless-escape
  return re.test(String(email).toLowerCase());
};

export const isNumeric = (text: string) => {
  const re = /^[0-9]+$/;
  return re.test(String(text));
};

export const isValidPhone = (phone: string) => {
  if (!isNumeric(phone)) {
    return false;
  }
  if (phone.length !== 10) {
    return false;
  }

  if (!phone.startsWith('98') && !phone.startsWith('96') && !phone.startsWith('97')) {
    return false;
  }

  return true;
};

export const isAlphaNumeric = (text: string) => {
  const re = /^[a-zA-Z0-9]+$/;
  return re.test(String(text));
};

export const isAlphabetic = (text: string) => {
  const re = /^[a-zA-Z]+$/;
  return re.test(String(text));
};

export const isAlphabeticWithSpace = (text: string) => {
  const re = /^[a-zA-Z\s]+$/;
  return re.test(String(text));
};

export const isValidDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return false;
  }
  return true;
};
