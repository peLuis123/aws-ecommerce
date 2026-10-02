import { afterEach, beforeEach, expect, it, vi } from "vitest";
import {
  cleanup,
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { FinancialAction } from "../src/components/admin/FinancialAction";
import { minorUnits } from "../src/utils/admin";
vi.mock("../src/hooks/useAuth", () => ({
  useAuth: () => ({ user: { userId: "qa-admin" } }),
}));
afterEach(cleanup);
beforeEach(() => {
  sessionStorage.clear();
  // jsdom does not implement the native dialog top layer.
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute("open", ""); };
  HTMLDialogElement.prototype.close = function () { this.removeAttribute("open"); };
});
it("converts decimal amounts without accepting zero, negatives or excessive precision", () => {
  expect(minorUnits("19.99")).toBe(1999);
  expect(minorUnits("0.29")).toBe(29);
  for (const value of ["0", "-1", "1.001", "", "1e3"])
    expect(() => minorUnits(value)).toThrow();
});
it("requires review and preserves request identity across uncertain failure and remount", async () => {
  const body = {
    amount: 1250,
    currency: "USD",
    merchantAccountId: "acct_test",
    payoutId: "payout-test",
    provider: "stripe",
  };
  const send = vi
    .fn()
    .mockRejectedValueOnce(new Error("Network error"))
    .mockResolvedValueOnce({ data: { status: "paid" } });
  const props = { kind: "payout", build: () => body, send };
  const first = render(
    <FinancialAction {...props}>
      <input aria-label="amount" defaultValue="12.50" />
    </FinancialAction>,
  );
  fireEvent.click(screen.getByText("Revisar solicitud"));
  expect(send).not.toHaveBeenCalled();
  fireEvent.click(screen.getByText("Confirmar solicitud"));
  await screen.findByRole("alert");
  expect(send).toHaveBeenCalledTimes(1);
  const key = send.mock.calls[0][1];
  first.unmount();
  render(
    <FinancialAction {...props}>
      <input aria-label="amount" />
    </FinancialAction>,
  );
  fireEvent.click(screen.getByText("Reintentar la misma solicitud"));
  await waitFor(() =>
    expect(screen.getByRole("status").textContent).toContain(
      "Solicitud registrada",
    ),
  );
  expect(send).toHaveBeenLastCalledWith(body, key);
});
it("does not send when validation fails", () => {
  const send = vi.fn();
  render(
    <FinancialAction
      kind="refund"
      build={() => {
        throw Error("Invalid amount");
      }}
      send={send}
    />,
  );
  fireEvent.click(screen.getByText("Revisar solicitud"));
  expect(screen.getByRole("alert").textContent).toContain("Invalid amount");
  expect(send).not.toHaveBeenCalled();
});
