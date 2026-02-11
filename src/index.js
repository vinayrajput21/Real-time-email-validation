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
                              } catch (error) {
                                  res.status(500).json({ error: "Internal server error" });
                                    }
                                    });

                                    // ✅ IMPORTANT LINE
                                    const PORT = process.env.PORT || 3000;

                                    app.listen(PORT, "0.0.0.0", () => {
                                      console.log(`Server running on port ${PORT}`);
                                      });