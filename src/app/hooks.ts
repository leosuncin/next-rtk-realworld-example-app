import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, AppState } from '@app/app/store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
const useAppDispatch = () => useDispatch<AppDispatch>();

const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;

export { useAppDispatch as useDispatch, useAppSelector as useSelector };
