import assert from "node:assert/strict";
import test from "node:test";
import { loginRedirect } from "./loginRedirect.js";

test("uses the correct landing page for each role", () => {
  assert.equal(loginRedirect({ role: "admin" }), "/admin");
  assert.equal(loginRedirect({ role: "buyer" }), "/cuenta");
});
test("preserves a protected checkout return URL including payment identification", () => {
  assert.equal(
    loginRedirect(
      { role: "buyer" },
      {
        pathname: "/checkout/success",
        search: "?paymentId=payment-123",
        hash: "#resumen",
      },
    ),
    "/checkout/success?paymentId=payment-123#resumen",
  );
});
test("does not return a buyer to an admin route or loop back to auth", () => {
  for (const pathname of ["/admin", "/admin/ordenes", "/login", "/register"])
    assert.equal(loginRedirect({ role: "buyer" }, { pathname }), "/cuenta");
  assert.equal(
    loginRedirect({ role: "admin" }, { pathname: "/admin/ordenes" }),
    "/admin/ordenes",
  );
});
test("rejects external or malformed destinations", () => {
  for (const pathname of [
    "https://example.com",
    "//example.com",
    "/\\example.com",
    "/\n/example.com",
    "",
    null,
  ])
    assert.equal(loginRedirect({ role: "buyer" }, { pathname }), "/cuenta");
});
