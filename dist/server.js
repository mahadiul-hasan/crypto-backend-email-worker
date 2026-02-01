"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const email_queue_1 = require("./email/queues/email.queue");
const app = (0, express_1.default)();
const port = process.env.PORT || 5001;
app.get("/admin/email/health", async (req, res) => {
    const stats = {
        waiting: await email_queue_1.emailQueue.getWaitingCount(),
        active: await email_queue_1.emailQueue.getActiveCount(),
        failed: await email_queue_1.emailQueue.getFailedCount(),
    };
    res.json(stats);
});
app.listen(port, () => {
    console.log(`email-worker listening on port ${port}`);
});
//# sourceMappingURL=server.js.map