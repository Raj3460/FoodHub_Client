// import { env } from "@/env"
// import { createAuthClient } from "better-auth/react"
// export const authClient = createAuthClient({
//     /** The base URL of the server (optional if you're using the same domain) */
//     baseURL: env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
//     credentials: "include", // Include cookies for authentication
// })


import { env } from "@/env"
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: (env.NEXT_PUBLIC_API_URL || "http://localhost:5000") + "/api/auth",
  fetchOptions: { credentials: "include" },
});

