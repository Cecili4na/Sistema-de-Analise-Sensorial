import { createCookieSessionStorage, redirect } from "@remix-run/node";

type UserSession = {
  userId: string;
  role: 'produtor' | 'analista' | 'julgador';
};

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_session",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: [process.env.SESSION_SECRET || 'default-secret'],
    secure: process.env.NODE_ENV === "production",
  },
});

export async function createUserSession(
  userId: string,
  role: UserSession['role'],
  redirectTo: string
) {
  const session = await sessionStorage.getSession();
  session.set("userId", userId);
  session.set("role", role);
  
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
}

export async function getUserSession(request: Request) {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );

  const userId = session.get("userId");
  const role = session.get("role");

  if (!userId || !role) return null;

  return { userId, role } as UserSession;
}

export async function requireUserSession(
  request: Request,
  allowedRoles?: UserSession['role'][]
) {
  const session = await getUserSession(request);

  if (!session) {
    throw redirect("/login");
  }

  if (allowedRoles && !allowedRoles.includes(session.role)) {
    throw redirect("/unauthorized");
  }

  return session;
}

export async function logout(request: Request) {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );

  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
} 