export function AdminFeedback({ error, message }) {
  return (
    <>
      {error && (
        <p className="admin-alert" role="alert">
          {error}
        </p>
      )}
      {message && (
        <p className="admin-success" role="status">
          {message}
        </p>
      )}
    </>
  );
}
