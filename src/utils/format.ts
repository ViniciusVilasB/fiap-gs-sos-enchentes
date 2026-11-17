export function formatPhoneNumber(phone: string) {
  const digits = phone.replace(/\D/g, '');

  let prefix = '';
  let national = digits;

  if (digits.startsWith('55') && (digits.length === 12 || digits.length === 13)) {
    prefix = '+55 ';
    national = digits.slice(2);
  }

  if (national.length === 11) {
    return `${prefix}(${national.slice(0, 2)}) ${national.slice(2, 7)}-${national.slice(7)}`;
  }

  if (national.length === 10) {
    return `${prefix}(${national.slice(0, 2)}) ${national.slice(2, 6)}-${national.slice(6)}`;
  }

  return phone;
}