'use client'

type GlobalErrorProps = {
    error: Error & { digest?: string }
    reset: () => void
}

export default function GlobalError({ reset, }: GlobalErrorProps) {
    return (
        <html>
            <body>
                <h2>Something went wrong!</h2>
                <button onClick={() => reset()}>Try again</button>
            </body>
        </html>
    )
}