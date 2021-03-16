/* eslint-env jest */
// eslint-disable-next-line import/no-unassigned-import
import '@testing-library/jest-dom';

// eslint-disable-next-line import/no-extraneous-dependencies
import { loadEnvConfig } from '@next/env';

loadEnvConfig(__dirname, true, { info: () => null, error: console.error });
