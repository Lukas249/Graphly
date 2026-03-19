"use client";

import NextError from "next/error";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  const [status, message] = error.message.split(":").map((val) => val.trim());
  const statusCode = Number(status);

  let errorComponent;

  if (!isNaN(statusCode)) {
    errorComponent = message ? (
      <NextError statusCode={statusCode} title={message} />
    ) : (
      <NextError statusCode={statusCode} />
    );
  } else {
    errorComponent = <NextError statusCode={500} />;
  }

  return errorComponent;
}
