export interface UserCredentials {
  email: string;
  password?: string;
  permanentPassword?: string;
  newPassword?: string;
  confirmCode?: string;
}

export type VForm = Vue & { validate: () => boolean };

export function emailRules(value: string): Array<boolean | string> {
  return [
    !!value || "Name is required",
    /.+@.+\..+/.test(value) || "E-mail must be valid",
  ];
}
export function passwordRules(value: string): Array<boolean | string> {
  return [
    !!value || "Password is required",

    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(
      value
    ) ||
      "Password should be atleast 8 character long,with a number , special character, uppercase and lower case letters.",
  ];
}

export function codeRules(value: string): Array<boolean | string> {
  return [/^\d{6}$/.test(value) || "Code musht have 6 numbers"];
}
export type AuthAction = "SignIn" | "SignUp" | "Confirm" | "Reset";
