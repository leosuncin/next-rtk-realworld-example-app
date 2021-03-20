import { useEffect } from 'react';

import type { ErrorResponse } from '@app/interfaces';
import { useDispatch } from '@app/store';
import { clearErrors } from '@app/store/shared.actions';

export interface ListErrorProps {
  error?: ErrorResponse['errors'];
}

function ListError({ error }: ListErrorProps) {
  const dispatch = useDispatch();
  if (!error) return null;

  useEffect(
    () => () => {
      dispatch(clearErrors());
    },
    [],
  );

  const errors = Object.keys(error)
    .map((key) => error[key].map((message) => `${key} ${message}`))
    .flat();

  return (
    <>
      <ul className="error-messages" data-testid="list-error-messages">
        {errors.map((message) => (
          <li key={message}>{message}</li>
        ))}
      </ul>
    </>
  );
}

export default ListError;
