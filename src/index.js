const { verifyEmail } = require("./services/verifyEmail");

(async () => {
  const result = await verifyEmail("user@giail.com");
  console.log(result);
})();
