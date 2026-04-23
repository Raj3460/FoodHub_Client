import { env } from "@/env";
import { cookies } from "next/headers";

const AUTH_URL = env.AUTH_URL;

export const userService = {
  getSession: async function () {
    try {
      const cookieStore = await cookies();

      console.log(cookieStore.toString());

      const res = await fetch(`${AUTH_URL}/get-session`, {
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const session = await res.json();

      if (session === null) {
        return { data: null, error: { message: "Session is missing." } };
      }

      return { data: session, error: null };
    } catch (err) {
      console.error(err);
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },
};


// // src/service/user.service.ts
// import { env } from "@/env";
// import { cookies } from "next/headers";

// const AUTH_URL = env.AUTH_URL;

// export const userService = {
//   getSession: async function () {
//     try {
//       const cookieStore = await cookies();

//       // ✅ Cookie সঠিকভাবে format করা
//       const cookieHeader = cookieStore
//         .getAll()
//         .map((c) => `${c.name}=${c.value}`)
//         .join("; ");

//       const res = await fetch(`${AUTH_URL}/api/auth/get-session`, {
//         headers: {
//           Cookie: cookieHeader,
//         },
//         cache: "no-store",
//       });

//       if (!res.ok) {
//         return { data: null, error: { message: "Failed to fetch session" } };
//       }

//       const session = await res.json();

//       if (!session || !session.user) {
//         return { data: null, error: { message: "Session is missing." } };
//       }

//       return { data: session, error: null };
//     } catch (err) {
//       console.error(err);
//       return { data: null, error: { message: "Something Went Wrong" } };
//     }
//   },
// };