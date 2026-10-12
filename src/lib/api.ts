import { NextResponse } from "next/server";
import { currentUser, validOrigin } from "./auth";
export const jsonError = (message: string, status = 400) =>
  NextResponse.json({ error: message }, { status });
export async function actorForWrite() {
  if (!(await validOrigin()))
    return { error: jsonError("Invalid request origin", 403) };
  try {
    const actor = await currentUser();
    if (!actor) return { error: jsonError("Authentication required", 401) };
    return { actor };
  } catch {
    return { error: jsonError("Service unavailable", 503) };
  }
}
export const parseBody = async (req: Request) => {
  try {
    return await req.json();
  } catch {
    return null;
  }
};
