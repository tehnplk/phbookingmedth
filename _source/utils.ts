
export const formatThaiDate = (date: Date) => {
  const day = date.getDate();
  const month = new Intl.DateTimeFormat('th-TH', { month: 'short' }).format(date);
  const year = (date.getFullYear() + 543).toString().slice(-2);
  return `${day} ${month} ${year}`;
};

export const formatThaiDateShort = (date: Date) => {
  const day = date.getDate();
  const month = new Intl.DateTimeFormat('th-TH', { month: 'short' }).format(date);
  // No year as requested
  return `${day} ${month}`;
};

export const formatThaiDateString = (isoDate: string) => {
  const date = new Date(isoDate);
  return formatThaiDate(date);
};

export const toISODateString = (date: Date) => {
  // Use local time for date string to avoid timezone shifts
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().split('T')[0];
};

export const formatPhoneNumber = (value: string) => {
  const phoneNumber = value.replace(/[^\d]/g, '');
  const phoneNumberLength = phoneNumber.length;
  if (phoneNumberLength < 4) return phoneNumber;
  if (phoneNumberLength < 7) {
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
  }
  return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
};
