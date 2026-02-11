# 📧 Email Verification Module (Node.js)

A production-ready Email Verification Module built using Node.js that validates email addresses using:

- Syntax validation (Regex)
- DNS MX record lookup
- SMTP mailbox verification
- "Did You Mean?" typo detection (Levenshtein Distance ≤ 2)
- Comprehensive Jest unit testing

---

## 🚀 Objective

This project implements an email verification system using the SMTP protocol with structured error handling.

It verifies:

1. Email format validity  
2. Domain mail server existence (MX records)  
3. Mailbox existence via SMTP (`RCPT TO`)  
4. Typo detection for common domain mistakes  

---

## 🏗️ Project Structure

```
email-verification-module/
│
├── src/
│   ├── services/
│   │   ├── verifyEmail.js
│   │   ├── smtpService.js
│   │   └── typoService.js
│   │
│   ├── utils/
│   │   └── emailValidator.js
│   │
│   └── index.js
│
├── tests/
│   └── verifyEmail.test.js
│
├── package.json
└── README.md
```

---

## ⚙️ Installation

```bash
git clone <your-repository-url>
cd email-verification-module
npm install
```

---

## ▶️ Run the Project

```bash
npm run dev
```

This runs:

```javascript
verifyEmail("user@gmial.com");
```

---

## 🧪 Run Tests

```bash
npm test
```

Includes:

- 15+ Jest test cases
- SMTP mocking
- DNS mocking
- Edge case handling
- Code coverage reporting

---

## 🔍 How It Works

### 1️⃣ Syntax Validation

Validates:

- Exactly one `@`
- No double dots
- Proper email structure

If invalid:

```json
{
  "result": "invalid",
    "subresult": "invalid_syntax"
    }
    ```

    ---

    ### 2️⃣ Did You Mean (Typo Detection)

    Uses Levenshtein distance (edit distance ≤ 2) to detect common domain typos:

    - gmial.com → gmail.com  
    - yahooo.com → yahoo.com  
    - hotmial.com → hotmail.com  
    - outlok.com → outlook.com  

    Example:

    ```json
    {
      "email": "user@gmial.com",
        "result": "invalid",
          "resultcode": 6,
            "subresult": "typo_detected",
              "didyoumean": "user@gmail.com"
              }
              ```

              Typo detection runs **before DNS lookup** to avoid unnecessary network calls.

              ---

              ### 3️⃣ DNS MX Lookup

              Uses Node.js DNS module:

              ```javascript
              dns.resolveMx(domain);
              ```

              If no MX records exist:

              ```json
              {
                "result": "invalid",
                  "subresult": "no_mx_records"
                  }
                  ```

                  ---

                  ### 4️⃣ SMTP Mailbox Verification

                  Performs SMTP handshake:

                  - HELO
                  - MAIL FROM
                  - RCPT TO

                  Handles response codes:

                  | SMTP Code | Meaning | Result |
                  |------------|----------|--------|
                  | 250 | Mailbox exists | valid |
                  | 550 | Mailbox not found | invalid |
                  | 450 | Temporary issue | unknown |
                  | timeout | No response | unknown |

                  ---

                  ## 📦 Example Successful Output

                  ```json
                  {
                    "email": "user@example.com",
                      "result": "valid",
                        "resultcode": 1,
                          "subresult": "mailbox_exists",
                            "domain": "example.com",
                              "mxRecords": ["mx1.example.com"],
                                "executiontime": 2,
                                  "error": null,
                                    "timestamp": "2026-02-11T10:30:00.000Z"
                                    }
                                    ```

                                    ---

                                    ## 🧠 Design Decisions

                                    - Typo detection runs before DNS lookup to improve performance.
                                    - SMTP and DNS are mocked in unit tests for reliable, deterministic testing.
                                    - Structured JSON response ensures scalability and API readiness.
                                    - Execution time is measured for performance monitoring.

                                    ---

                                    ## 🔒 Limitations

                                    - Some SMTP servers block port 25.
                                    - Some providers use catch-all mailboxes.
                                    - Greylisting may result in `unknown`.

                                    In production systems, retry strategies and multi-MX validation are typically implemented.

                                    ---

                                    ## 🛠️ Tech Stack

                                    - Node.js
                                    - DNS module
                                    - net (SMTP connection)
                                    - fast-levenshtein
                                    - Jest

                                    ---

                                    ## 👨‍💻 Author

                                    **Vinay Pawar**  
                                    Full Stack Developer (MERN)