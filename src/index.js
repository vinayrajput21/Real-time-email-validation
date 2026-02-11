const { verifyEmail } = require("./services/verifyEmail");

(async () => {
  const result = await verifyEmail("user@gmial.com");
  console.log(result);
})();
