
const dns = require("dns").promises;
const { validateEmailSyntax } = require("../utils/emailvalidator");
const { getDidYouMean } = require("./typoService");
const { checkSMTP } = require("./smtpService");

async function verifyEmail(email) {
  const startTime = Date.now();
    const timestamp = new Date().toISOString();

      const response = {
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
                                                  
                                                      if (!validateEmailSyntax(email)) {
                                                            response.subresult = "invalid_syntax";
                                                                  return finalize(response, startTime);
                                                                      }

                                                                          const domain = email.split("@")[1];
                                                                              response.domain = domain;
                                                                                      const suggestion = getDidYouMean(email);
                                                                                          if (suggestion) {
                                                                                                response.subresult = "typo_detected";
                                                                                                      response.didyoumean = suggestion;
                                                                                                            return finalize(response, startTime);
                                                                                                                }

                                                                                                              
                                                                                                                        let mxRecords;
                                                                                                                            try {
                                                                                                                                  mxRecords = await dns.resolveMx(domain);
                                                                                                                                      } catch (err) {
                                                                                                                                            response.result = "unknown";
                                                                                                                                                  response.resultcode = 3;
                                                                                                                                                        response.subresult = "dns_error";
                                                                                                                                                              response.error = err.message;
                                                                                                                                                                    return finalize(response, startTime);
                                                                                                                                                                        }

                                                                                                                                                                            if (!mxRecords || mxRecords.length === 0) {
                                                                                                                                                                                  response.subresult = "no_mx_records";
                                                                                                                                                                                        return finalize(response, startTime);
                                                                                                                                                                                            }

                                                                                                                                                                                                response.mxRecords = mxRecords.map(mx => mx.exchange);

                                                                                                                                                                                                    
                                                                                                                                                                                                        const smtpResult = await checkSMTP(
                                                                                                                                                                                                              mxRecords[0].exchange,
                                                                                                                                                                                                                    email
                                                                                                                                                                                                                        );

                                                                                                                                                                                                                            if (smtpResult.code === 250) {
                                                                                                                                                                                                                                  response.result = "valid";
                                                                                                                                                                                                                                        response.resultcode = 1;
                                                                                                                                                                                                                                              response.subresult = "mailbox_exists";
                                                                                                                                                                                                                                                  } 
                                                                                                                                                                                                                                                      else if (smtpResult.code === 550) {
                                                                                                                                                                                                                                                            response.result = "invalid";
                                                                                                                                                                                                                                                                  response.resultcode = 6;
                                                                                                                                                                                                                                                                        response.subresult = "mailbox_does_not_exist";
                                                                                                                                                                                                                                                                            } 
                                                                                                                                                                                                                                                                                else if (smtpResult.code === 450) {
                                                                                                                                                                                                                                                                                      response.result = "unknown";
                                                                                                                                                                                                                                                                                            response.resultcode = 3;
                                                                                                                                                                                                                                                                                                  response.subresult = "greylisted";
                                                                                                                                                                                                                                                                                                      } 
                                                                                                                                                                                                                                                                                                          else if (smtpResult.code === "timeout") {
                                                                                                                                                                                                                                                                                                                response.result = "unknown";
                                                                                                                                                                                                                                                                                                                      response.resultcode = 3;
                                                                                                                                                                                                                                                                                                                            response.subresult = "connection_timeout";
                                                                                                                                                                                                                                                                                                                                } 
                                                                                                                                                                                                                                                                                                                                    else {
                                                                                                                                                                                                                                                                                                                                          response.result = "unknown";
                                                                                                                                                                                                                                                                                                                                                response.resultcode = 3;
                                                                                                                                                                                                                                                                                                                                                      response.subresult = "connection_error";
                                                                                                                                                                                                                                                                                                                                                          }

                                                                                                                                                                                                                                                                                                                                                              return finalize(response, startTime);

                                                                                                                                                                                                                                                                                                                                                                } catch (error) {
                                                                                                                                                                                                                                                                                                                                                                    response.result = "unknown";
                                                                                                                                                                                                                                                                                                                                                                        response.resultcode = 3;
                                                                                                                                                                                                                                                                                                                                                                            response.subresult = "unexpected_error";
                                                                                                                                                                                                                                                                                                                                                                                response.error = error.message;
                                                                                                                                                                                                                                                                                                                                                                                    return finalize(response, startTime);
                                                                                                                                                                                                                                                                                                                                                                                      }
                                                                                                                                                                                                                                                                                                                                                                                      }

                                                                                                                                                                                                                                                                                                                                                                                      function finalize(response, startTime) {
                                                                                                                                                                                                                                                                                                                                                                                        response.executiontime =
                                                                                                                                                                                                                                                                                                                                                                                            (Date.now() - startTime) / 1000;
                                                                                                                                                                                                                                                                                                                                                                                              return response;
                                                                                                                                                                                                                                                                                                                                                                                              }

                                                                                                                                                                                                                                                                                                                                                                                              module.exports = { verifyEmail };
