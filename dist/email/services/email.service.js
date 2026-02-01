"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const bottleneck_1 = __importDefault(require("bottleneck"));
const email_queue_1 = require("../queues/email.queue");
const limiter = new bottleneck_1.default({
    maxConcurrent: 5,
    minTime: 50,
});
class EmailService {
    static async enqueue(payload) {
        if (!payload.to || !payload.subject || !payload.html) {
            throw new Error("Invalid email payload");
        }
        if (payload.html.length > 500000) {
            throw new Error("Email body too large");
        }
        const jobId = payload.key || `${payload.to}:${payload.subject}`;
        try {
            return await limiter.schedule(() => email_queue_1.emailQueue.add("send", payload, {
                jobId,
            }));
        }
        catch (err) {
            console.error("Email enqueue failed:", err);
        }
    }
}
exports.EmailService = EmailService;
//# sourceMappingURL=email.service.js.map