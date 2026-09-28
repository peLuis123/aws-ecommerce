export function loginRedirect(user, from) {
  const fallback = user?.role === "admin" ? "/admin" : "/cuenta";
  const pathname = from?.pathname;
  if (
    typeof pathname !== "string" ||
    !pathname.startsWith("/") ||
    pathname.startsWith("//") ||
    pathname.includes("\\") ||
    Array.from(pathname).some((character) => character.charCodeAt(0) <= 32)
  )
    return fallback;
  if (["/login", "/register"].includes(pathname)) return fallback;
  if (
    (pathname === "/admin" || pathname.startsWith("/admin/")) &&
    user?.role !== "admin"
  )
    return fallback;
  const search =
    typeof from.search === "string" && from.search.startsWith("?")
      ? from.search
      : "";
  const hash =
    typeof from.hash === "string" && from.hash.startsWith("#") ? from.hash : "";
  return `${pathname}${search}${hash}`;
}
