import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/auth/auth";

// This will run for every page request or API request
export default async function proxy(request: NextRequest) {
  const session = await getSession();
  /*
  // check if the user is trying to access the dasboard page but i wantto do it in my dashboard page
  const isDashboardPage = request.nextUrl.pathname.startsWith("/dashboard");

  if (isDashboardPage && !session?.user) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
*/
  // when logged in, the user cannot access the signin and signup pages
  const isSignInPage = request.nextUrl.pathname.startsWith("/sign-in");
  const isSignUpPage = request.nextUrl.pathname.startsWith("/sign-up");

  if ((isSignInPage || isSignUpPage) && session?.user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // This is like telling it to contine to the next route/destination if the conditions are all met
  return NextResponse.next();
}
