/* eslint-env jest */
/* eslint-disable import/no-unassigned-import */
import '@testing-library/jest-dom';
import 'whatwg-fetch';

// eslint-disable-next-line import/no-extraneous-dependencies
import { loadEnvConfig } from '@next/env';

loadEnvConfig(__dirname, true, { info: () => null, error: console.error });
