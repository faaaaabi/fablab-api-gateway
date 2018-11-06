"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const port = 8081;
app_1.default.listen(port, () => {
    console.log(`Server started. Listening on port ${port}`);
});
//# sourceMappingURL=server.js.map