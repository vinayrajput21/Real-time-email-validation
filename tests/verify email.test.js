const dns = require("dns").promises;
const { verifyEmail } = require("../src/services/verifyEmail");
const { validateEmailSyntax } = require("../src/utils/emailvalidator");
const { getDidYouMean } = require("../src/services/typoService");

jest.mock("../src/services/smtpService", () => ({
  checkSMTP: jest.fn()
  }));

  const { checkSMTP } = require("../src/services/smtpService");

  jest.spyOn(dns, "resolveMx");

  describe("Email Syntax Validation Tests", () => {

    test("Valid email passes", () => {
        expect(validateEmailSyntax("test@gmail.com")).toBe(true);
          });

            test("Missing @ fails", () => {
                expect(validateEmailSyntax("testgmail.com")).toBe(false);
                  });

                    test("Double dots fails", () => {
                        expect(validateEmailSyntax("a..b@gmail.com")).toBe(false);
                          });

                            test("Multiple @ fails", () => {
                                expect(validateEmailSyntax("a@b@c.com")).toBe(false);
                                  });

                                    test("Empty string fails", () => {
                                        expect(validateEmailSyntax("")).toBe(false);
                                          });

                                            test("Null fails", () => {
                                                expect(validateEmailSyntax(null)).toBe(false);
                                                  });

                                                    test("Undefined fails", () => {
                                                        expect(validateEmailSyntax(undefined)).toBe(false);
                                                          });

                                                          });

                                                          describe("Did You Mean Tests", () => {

                                                            test("Detects gmial.com typo", () => {
                                                                expect(getDidYouMean("user@gmial.com"))
                                                                      .toBe("user@gmail.com");
                                                                        });

                                                                          test("Detects yahooo typo", () => {
                                                                              expect(getDidYouMean("user@yahooo.com"))
                                                                                    .toBe("user@yahoo.com");
                                                                                      });

                                                                                        test("Detects hotmial typo", () => {
                                                                                            expect(getDidYouMean("user@hotmial.com"))
                                                                                                  .toBe("user@hotmail.com");
                                                                                                    });

                                                                                                      test("Detects outlok typo", () => {
                                                                                                          expect(getDidYouMean("user@outlok.com"))
                                                                                                                .toBe("user@outlook.com");
                                                                                                                  });

                                                                                                                  });

                                                                                                                  describe("SMTP & DNS Integration Tests (Mocked)", () => {

                                                                                                                    beforeEach(() => {
                                                                                                                        jest.clearAllMocks();
                                                                                                                          });

                                                                                                                            test("550 error returns invalid", async () => {
                                                                                                                                dns.resolveMx.mockResolvedValue([{ exchange: "mx.test.com" }]);
                                                                                                                                    checkSMTP.mockResolvedValue({ code: 550 });

                                                                                                                                        const result = await verifyEmail("user@test.com");

                                                                                                                                            expect(result.result).toBe("invalid");
                                                                                                                                                expect(result.subresult).toBe("mailbox_does_not_exist");
                                                                                                                                                  });

                                                                                                                                                    test("450 error returns unknown", async () => {
                                                                                                                                                        dns.resolveMx.mockResolvedValue([{ exchange: "mx.test.com" }]);
                                                                                                                                                            checkSMTP.mockResolvedValue({ code: 450 });

                                                                                                                                                                const result = await verifyEmail("user@test.com");

                                                                                                                                                                    expect(result.result).toBe("unknown");
                                                                                                                                                                      });

                                                                                                                                                                        test("250 returns valid", async () => {
                                                                                                                                                                            dns.resolveMx.mockResolvedValue([{ exchange: "mx.test.com" }]);
                                                                                                                                                                                checkSMTP.mockResolvedValue({ code: 250 });

                                                                                                                                                                                    const result = await verifyEmail("user@test.com");

                                                                                                                                                                                        expect(result.result).toBe("valid");
                                                                                                                                                                                            expect(result.subresult).toBe("mailbox_exists");
                                                                                                                                                                                              });

                                                                                                                                                                                                test("Connection timeout returns unknown", async () => {
                                                                                                                                                                                                    dns.resolveMx.mockResolvedValue([{ exchange: "mx.test.com" }]);
                                                                                                                                                                                                        checkSMTP.mockResolvedValue({ code: "timeout" });

                                                                                                                                                                                                            const result = await verifyEmail("user@test.com");

                                                                                                                                                                                                                expect(result.result).toBe("unknown");
                                                                                                                                                                                                                  });

                                                                                                                                                                                                                    test("DNS failure handled properly", async () => {
                                                                                                                                                                                                                        dns.resolveMx.mockRejectedValue(new Error("DNS failed"));

                                                                                                                                                                                                                            const result = await verifyEmail("user@test.com");

                                                                                                                                                                                                                                expect(result.result).toBe("unknown");
                                                                                                                                                                                                                                    expect(result.subresult).toBe("dns_error");
                                                                                                                                                                                                                                      });

                                                                                                                                                                                                                                        test("Very long email handled", async () => {
                                                                                                                                                                                                                                            dns.resolveMx.mockResolvedValue([{ exchange: "mx.test.com" }]);
                                                                                                                                                                                                                                                checkSMTP.mockResolvedValue({ code: 250 });

                                                                                                                                                                                                                                                    const longEmail = "a".repeat(100) + "@test.com";

                                                                                                                                                                                                                                                        const result = await verifyEmail(longEmail);

                                                                                                                                                                                                                                                            expect(result.email).toBe(longEmail);
                                                                                                                                                                                                                                                              });

                                                                                                                                                                                                                                                              });
