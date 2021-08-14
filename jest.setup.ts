/* eslint-env jest */
/* eslint-disable import/no-unassigned-import */
import '@testing-library/jest-dom';
import 'whatwg-fetch';

// eslint-disable-next-line import/no-extraneous-dependencies
import { loadEnvConfig } from '@next/env';

loadEnvConfig(process.cwd(), true, { info: () => null, error: console.error });
// @ts-expect-error fixes `TypeError: Cannot read property 'gssp' of undefined`
globalThis.__NEXT_DATA__ = {};
