import { expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({
  upload: vi.fn(),
  url: vi.fn(),
  ref: vi.fn((_s, path) => ({ path })),
}));
vi.mock("firebase/storage", () => ({
  setMaxUploadRetryTime: vi.fn(),
  uploadBytesResumable: mocks.upload,
  getDownloadURL: mocks.url,
  ref: mocks.ref,
}));
vi.mock("../src/config/firebase", () => ({ storage: {} }));
import { uploadProductImage } from "../src/services/productImages";
it("rejects unsupported types and oversized files before uploading", () => {
  expect(() =>
    uploadProductImage({ type: "image/svg+xml", size: 100 }),
  ).toThrow();
  expect(() =>
    uploadProductImage({ type: "image/png", size: 5242881 }),
  ).toThrow();
  expect(mocks.upload).not.toHaveBeenCalled();
});
it("returns the Firebase URL and reports progress for a unique product path", async () => {
  mocks.url.mockResolvedValue("https://example.com/product.png");
  const task = {
    snapshot: { ref: {} },
    on: (_event, progress, _error, done) => {
      progress({ bytesTransferred: 100, totalBytes: 100 });
      done();
    },
  };
  mocks.upload.mockReturnValue(task);
  const progress = vi.fn();
  expect(
    await uploadProductImage({ type: "image/png", size: 100 }, progress),
  ).toBe("https://example.com/product.png");
  expect(progress).toHaveBeenCalledWith(100);
  expect(mocks.ref.mock.calls[0][1]).toMatch(/^products\/[a-f0-9-]+\.png$/);
});
