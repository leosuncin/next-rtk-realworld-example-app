import { useEffect } from 'react';

import { clearErrors } from '@app/common/actions';
import type { ApiError } from '@app/common/types';
import { useDispatch } from '@app/store';

function ListErrors({ errors }: Partial<ApiError>) {
  const dispatch = useDispatch();

  useEffect(
    () => () => {
      dispatch(clearErrors());
    },
    [dispatch],
  );

  if (!errors || Object.keys(errors).length === 0) {
    return null;
  }

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
