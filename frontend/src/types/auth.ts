type LoginCredentials = {
  emailOrUsername: string;
  password: string;
};

type RegisterCredentials = {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
};

type VerifyPayload = {
  email?: string;
  code: string;
};

export type { LoginCredentials, RegisterCredentials, VerifyPayload };
