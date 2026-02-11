

const net = require("net");
function checkSMTP(mxHost, email) {
  return new Promise((resolve) => {
    const socket = net.createConnection(25, mxHost);
    socket.setTimeout(8000);

    let stage = 0;
    let response = "";

    socket.on("data", (data) => {
      response += data.toString();

      if (response.includes("220") && stage === 0) {
        socket.write("HELO example.com\r\n");
        stage++;
      } else if (response.includes("250") && stage === 1) {
        socket.write("MAIL FROM:<test@example.com>\r\n");
        stage++;
      } else if (response.includes("250") && stage === 2) {
        socket.write(`RCPT TO:<${email}>\r\n`);
        stage++;
      } else if (stage === 3) {
        if (response.includes("250")) {
          socket.end();
          resolve({ valid: true, code: 250 });
        } else if (response.includes("550")) {
          socket.end();
          resolve({ valid: false, code: 550 });
        } else if (response.includes("450")) {
          socket.end();
          resolve({ valid: null, code: 450 });
        }
      }
    });

    socket.on("timeout", () => {
      socket.destroy();
      resolve({ valid: null, code: "timeout" });
    });

    socket.on("error", () => {
      resolve({ valid: null, code: "connection_error" });
    });
  });
}

module.exports = { checkSMTP };
