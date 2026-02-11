// src/services/verifyEmail.js

const dns = require("dns").promises;
const { validateEmailSyntax } = require("../utils/emailValidator");
const { getDidYouMean } = require("./typoService");
const { checkSMTP } = require("./smtpService");

async function verifyEmail(email) {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();

  const baseResponse = {
    email,
    result: "invalid",
    resultcode: 6,
    subresult: null,
    domain: null,
    mxRecords: [],
    executiontime: 0,
    error: null,
    timestamp,
  };

  try {
    // Syntax Validation
    if (!validateEmailSyntax(email)) {
      baseResponse.subresult = "invalid_syntax";
      return finalize(baseResponse, startTime);
    }

    const domain = email.split("@")[1];
    baseResponse.domain = domain;

    // MX Lookup
    const mxRecords = await dns.resolveMx(domain);
    if (!mxRecords || mxRecords.length === 0) {
      baseResponse.subresult = "no_mx_records";
      return finalize(baseResponse, startTime);
    }

    baseResponse.mxRecords = mxRecords.map(mx => mx.exchange);

    // SMTP Check (use first MX)
    const smtpResult = await checkSMTP(
      mxRecords[0].exchange,
      email
    );

    if (smtpResult.code === 250) {
      baseResponse.result = "valid";
      baseResponse.resultcode = 1;
      baseResponse.subresult = "mailbox_exists";
    } else if (smtpResult.code === 550) {
      baseResponse.subresult = "mailbox_does_not_exist";
    } else {
      baseResponse.result = "unknown";
      baseResponse.resultcode = 3;
      baseResponse.subresult = "connection_error";
    }

    // Typo detection
    const suggestion = getDidYouMean(email);
    if (suggestion && baseResponse.result !== "valid") {
      baseResponse.subresult = "typo_detected";
      baseResponse.didyoumean = suggestion;
    }

    return finalize(baseResponse, startTime);

  } catch (error) {
    baseResponse.result = "unknown";
    baseResponse.resultcode = 3;
    baseResponse.subresult = "dns_error";
    baseResponse.error = error.message;
    return finalize(baseResponse, startTime);
  }
}

function finalize(response, startTime) {
  response.executiontime =
    (Date.now() - startTime) / 1000;
  return response;
}

module.exports = { verifyEmail };
