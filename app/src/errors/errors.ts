import { ApolloError } from 'apollo-server';

export class SyntaxError extends ApolloError {
  constructor(message: string) {
    super(message, 'GRAPHQL_PARSE_FAILED');

    Object.defineProperty(this, 'name', { value: 'SyntaxError' });
  }
}

export class LoginError extends ApolloError {
  constructor(message: string) {
    super(message, 'LOGIN FAILED');

    Object.defineProperty(this, 'name', { value: 'LoginError' });
  }
}

export class RegistrationError extends ApolloError {
  constructor(message: string) {
    super(message, 'REGISTRATION FAILED');

    Object.defineProperty(this, 'name', { value: 'RegistrationError' });
  }
}
