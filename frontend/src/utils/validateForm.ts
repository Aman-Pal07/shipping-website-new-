/**
 * Validate an email address
 * @param email Email to validate
 * @returns True if email is valid
 */
export const validateEmail = (email: string): boolean => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

/**
 * Validate a password (minimum 8 characters, at least one letter and one number)
 * @param password Password to validate
 * @returns True if password is valid
 */
export const validatePassword = (password: string): boolean => {
  const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return re.test(password);
};

/**
 * Validate a username (3-20 characters, alphanumeric and underscores only)
 * @param username Username to validate
 * @returns True if username is valid
 */
export const validateUsername = (username: string): boolean => {
  const re = /^[a-zA-Z0-9_]{3,20}$/;
  return re.test(username);
};

/**
 * Validate a verification code (6 digits)
 * @param code Verification code to validate
 * @returns True if code is valid
 */
export const validateVerificationCode = (code: string): boolean => {
  const re = /^[0-9]{6}$/;
  return re.test(code);
};

/**
 * Validate form fields
 * @param fields Object containing form fields
 * @param rules Object containing validation rules
 * @returns Object containing validation errors
 */
export const validateForm = (
  fields: Record<string, string>,
  rules: Record<string, (value: string) => boolean>
): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  Object.entries(rules).forEach(([fieldName, validationFn]) => {
    const value = fields[fieldName];
    if (!value || !validationFn(value)) {
      errors[fieldName] = `Invalid ${fieldName}`;
    }
  });
  
  return errors;
};
