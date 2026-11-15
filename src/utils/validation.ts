export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isValidPhoneNumber(phoneNumber: string) {
  const normalizedPhone = phoneNumber.trim();
  if (!/^\+?[\d\s()-]+$/.test(normalizedPhone)) {
    return false;
  }

  const digits = normalizedPhone.replace(/\D/g, '');
  const isBrazilianNationalNumber = digits.length === 10 || digits.length === 11;
  const isBrazilianInternationalNumber =
    digits.startsWith('55') && (digits.length === 12 || digits.length === 13);

  return isBrazilianNationalNumber || isBrazilianInternationalNumber;
}
