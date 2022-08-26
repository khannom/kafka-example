"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const kafka_node_1 = require("kafka-node");
const types_1 = require("./types");
const kafkaClient = new kafka_node_1.KafkaClient({ kafkaHost: "desktop-pc:9092" });
const producer = new kafka_node_1.Producer(kafkaClient);
const app = (0, express_1.default)();
const port = 3000;
// parse request body as json
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.post("/comment", (req, res) => {
    const commentData = req.body;
    const stringifiedComment = JSON.stringify(commentData);
    console.log(`GOT ${stringifiedComment}`);
    producer.send([{ topic: types_1.COMMENTS_TOPIC, messages: stringifiedComment }], (err, data) => { });
    console.log("SENT");
    res.send("DONE");
});
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
//# sourceMappingURL=app.js.map