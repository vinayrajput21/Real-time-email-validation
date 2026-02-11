const express = require("express");
const { verifyEmail } = require("./services/verifyEmail");

const app = express();
app.use(express.json());

app.post("/verify-email", async (req, res) => {
  try {
      const { email } = req.body;

          if (!email) {
                return res.status(400).json({ error: "Email is required" });
                    }

                        const result = await verifyEmail(email);
                            res.json(result);

                              } catch (err) {
                                  res.status(500).json({ error: "Internal server error" });
                                    }
                                    });

                                    const PORT = process.env.PORT || 3000;

                                    app.listen(PORT, () => {
                                      console.log(`Server running on port ${PORT}`);
                                      });    