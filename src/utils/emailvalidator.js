function validateEmailSyntax(email) {
  if (!email || typeof email !== "string") {
    return false;
  }

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return false;
  }

  if (email.includes("..")) {
    return false;
  }

  if ((email.match(/@/g) || []).length !== 1) {
    return false;
  }

  return true;
}

module.exports = { validateEmailSyntax };
