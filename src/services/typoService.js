// src/services/typoService.js

const levenshtein = require("fast-levenshtein");

const commonDomains = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com"
];

function getDidYouMean(email) {
  const [localPart, domain] = email.split("@");
  if (!domain) return null;

  for (const validDomain of commonDomains) {
    const distance = levenshtein.get(domain, validDomain);
    if (distance <= 2) {
      return `${localPart}@${validDomain}`;
    }
  }

  return null;
}

module.exports = { getDidYouMean };
