import * as Factory from 'factory.ts';
import faker from 'faker';
import { rest } from 'msw';

import type {
  AuthResponse,
  Login,
  Register,
} from '@app/features/auth/auth-api';

const emails = new Set(['john@doe.me', 'warren.boyd@mailinator.com']);
const emailRegex =
  /^[\w.!#$%&'*+\\/=?^`{|}~-]+@[a-zA-Z\d](?:[a-zA-Z\d-]{0,61}[a-zA-Z\d])?(?:\.[a-zA-Z\d](?:[a-zA-Z\d-]{0,61}[a-zA-Z\d])?)*$/;

export const registerFactory = Factory.Sync.makeFactory<Register>({
  username: Factory.each(() => faker.internet.userName()),
  email: Factory.each(() => faker.internet.exampleEmail()),
  password: Factory.each(() => faker.internet.password()),
});

export const loginFactory = Factory.Sync.makeFactory<Login>({
  email: Factory.each(() => faker.internet.exampleEmail()),
  password: Factory.each(() => faker.internet.password()),
});

export const userFactory = Factory.Sync.makeFactory<AuthResponse['user']>({
  bio: Factory.each(() => faker.hacker.phrase()),
  image: Factory.each(() => faker.internet.avatar()),
  token: Factory.each(() => faker.datatype.uuid()),
  username: Factory.each(() => faker.internet.userName()),
  email: Factory.each(() => faker.internet.exampleEmail()),
});

export const registerHandler = rest.post<{ user: Register }>(
  `${process.env.NEXT_PUBLIC_API_ROOT}/users`,
  (request, response, context) => {
    const user = userFactory.build(request.body.user);
    user.token = JSON.stringify({ sub: user.username });
    const errors: Record<string, string[]> = {};

    if (!request.body.user.email) {
      errors.email = ["can't be blank"];
    }

    if (!emailRegex.test(request.body.user.email)) {
      errors.email = ['is invalid'];
    }

    if (emails.has(request.body.user.email)) {
      errors.email = ['has already been taken'];
    }

    if (!request.body.user.password) {
      errors.password = ["can't be blank"];
    }

    if (request.body.user.password.length < 8) {
      errors.password = ['is too short (minimum is 8 characters)'];
    }

    if (request.body.user.password.length > 72) {
      errors.password = ['is too long (maximum is 72 characters)'];
    }

    if (!request.body.user.username) {
      errors.username = ["can't be blank"];
    }

    if (request.body.user.username.length === 0) {
      errors.username = ['is too short (minimum is 1 character)'];
    }

    if (request.body.user.username.length > 20) {
      errors.username = ['is too long (maximum is 20 characters)'];
    }

    if (Object.keys(errors).length > 0) {
      return response(
        context.status(422),
        context.json({ errors }),
        context.delay(),
      );
    }

    return response(context.json({ user }), context.delay());
  },
);

export const loginHandler = rest.post<{ user: Login }>(
  `${process.env.NEXT_PUBLIC_API_ROOT}/users/login`,
  (request, response, context) => {
    if (
      !emails.has(request.body.user.email) &&
      request.body.user.password !== 'Pa$$w0rd!'
    ) {
      return response(
        context.status(422),
        context.json({
          errors: {
            'email or password': ['is invalid'],
          },
        }),
        context.delay(),
      );
    }

    const user = userFactory.build(request.body.user);

    user.token = JSON.stringify({ sub: user.username });

    return response(context.json({ user }), context.delay());
  },
);
