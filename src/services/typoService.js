const levenshtein = require("fast-levenshtein");

const commonDomains = [
  "gmail.com",
    "yahoo.com",
      "hotmail.com",
        "outlook.com"
        ];

        function getDidYouMean(email) {
          if (!email || !email.includes("@")) return null;

            const [localPart, domain] = email.split("@");

              if (!domain) return null;

                for (const validDomain of commonDomains) {
                        if (domain === validDomain) {
                              return null;
                                  }

                                      const distance = levenshtein.get(domain, validDomain);
                                              if (distance > 0 && distance <= 2) {
                                                    return `${localPart}@${validDomain}`;
                                                        }
                                                          }

                                                            return null;
                                                            }

                                                            module.exports = { getDidYouMean };
