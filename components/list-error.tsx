import type { ErrorResponse } from '@app/interfaces';

export interface ListErrorProps {
  error?: ErrorResponse['errors'];
}

function ListError({ error }: ListErrorProps) {
  if (!error) return null;

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
