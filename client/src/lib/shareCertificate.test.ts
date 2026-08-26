import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

/** @vitest-environment jsdom */
import { openLinkedInCertificateShare, buildLinkedInPostText } from "./shareCertificate";

describe("openLinkedInCertificateShare", () => {
  const originalTitle = "CyberDimension Academy";

  beforeEach(() => {
    document.title = originalTitle;
    vi.stubGlobal("window", {
      ...window,
      open: vi.fn(),
      location: { origin: "https://cyberacad-nxanwdyc.manus.space" },
    });
    vi.stubGlobal("navigator", {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("opens the LinkedIn post page and copies the verification URL to the clipboard", async () => {
    const opened = openLinkedInCertificateShare("CDA-12345-ABC", "o teste Descubra Sua Carreira");
    expect(window.open).toHaveBeenCalledOnce();
    const url = (window.open as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
    expect(url).toContain("https://www.linkedin.com/feed/?shareActive=true");
    expect(url).not.toContain("share-offsite");
    expect((window.open as ReturnType<typeof vi.fn>).mock.calls[0][1]).toBe("_blank");
    expect(opened).not.toBeNull();

    await new Promise((resolve) => setTimeout(resolve, 400));
    expect(navigator.clipboard.writeText).toHaveBeenCalledOnce();
    const copied = (navigator.clipboard.writeText as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
    expect(copied).toContain("Acabei de concluir o teste Descubra Sua Carreira");
    expect(copied).toContain(
      "https://cyberacad-nxanwdyc.manus.space/verify-certificate?identifier=CDA-12345-ABC",
    );
  });

  it("falls back to redirecting when the popup cannot be opened", async () => {
    (window.open as ReturnType<typeof vi.fn>).mockReturnValue(null);
    openLinkedInCertificateShare("CDA-99", "");
    expect(window.location.href).toContain("https://www.linkedin.com/feed/?shareActive=true");
    await new Promise((resolve) => setTimeout(resolve, 400));
    expect(navigator.clipboard.writeText).toHaveBeenCalledOnce();
  });

  it("sets a descriptive document title temporarily while the window is opening", async () => {
    openLinkedInCertificateShare("CDA-12345-ABC");
    expect(document.title).toContain("CDA-12345-ABC");
    await new Promise((resolve) => setTimeout(resolve, 400));
    expect(document.title).toBe(originalTitle);
  });
});

describe("buildLinkedInPostText", () => {
  it("builds a post text that includes the description and verification URL", () => {
    const text = buildLinkedInPostText(
      "https://cyberacad-nxanwdyc.manus.space/verify-certificate?identifier=ABC",
      "a formação Blue Team & SOC",
    );
    expect(text).toContain("Acabei de concluir a formação Blue Team & SOC");
    expect(text).toContain("CyberDimension Academy");
    expect(text).toContain("identifier=ABC");
  });
});
