import { useEffect } from 'react';

import { useDispatch } from '@app/app/hooks';
import { clearErrors } from '@app/common/actions';
import type { ApiError } from '@app/common/types';

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
