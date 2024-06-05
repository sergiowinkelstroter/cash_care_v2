"use client";

import { ShieldX } from "lucide-react";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html>
      <body className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <ShieldX className="h-12 w-12 text-red-600 mx-auto" />
          <h2 className="mt-4 text-xl font-bold text-gray-800">
            Algo deu errado!
          </h2>
          <p className="mt-2 text-gray-600">{error.message}</p>
          {error.digest && (
            <p className="mt-1 text-gray-500 text-sm">
              Código de erro: {error.digest}
            </p>
          )}
          <button
            onClick={() => reset()}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Tentar novamente
          </button>
        </div>
      </body>
    </html>
  );
}
