import { useEffect } from 'react';

import type { ApiError } from '@app/common/types';
import { useDispatch } from '@app/store';
import { clearErrors } from '@app/store/shared.actions';

function ListErrors({ errors }: Partial<ApiError>) {
  const dispatch = useDispatch();

  if (!errors || Object.keys(errors).length === 0) {
    return null;
  }

  useEffect(
    () => () => {
      dispatch(clearErrors());
    },
    [dispatch],
  );

  const errorMessages = Object.entries(errors).flatMap(([property, messages]) =>
    messages.map((message) => `${property} ${message}`),
  );

  return (
    <ul className="error-messages">
      {errorMessages.map((message) => (
        <li key={message}>{message}</li>
      ))}
    </ul>
  );
}

export default ListErrors;
