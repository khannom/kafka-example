"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kafka_node_1 = require("kafka-node");
const node_postgres_1 = require("node-postgres");
const types_1 = require("./types");
const dbClient = new node_postgres_1.Client({
    user: "admin",
    host: "desktop-pc",
    database: "kafka-example-db",
    password: "postgres",
    port: 5432,
});
dbClient.connect();
const kafkaClient = new kafka_node_1.KafkaClient({ kafkaHost: "desktop-pc:9092" });
const consumers = new kafka_node_1.Consumer(kafkaClient, [{ topic: types_1.COMMENTS_TOPIC }, { topic: types_1.PREDICTIONS_TOPIC }], {});
consumers.on("message", function (message) {
    try {
        if (message.topic === types_1.COMMENTS_TOPIC &&
            typeof message.value === "string") {
            const commentData = JSON.parse(message.value);
            console.log(`RECEIVED COMMENT ${JSON.stringify(commentData)}`);
            try {
                // save comment data in db
                dbClient.query(`INSERT INTO comments (id, post_id, content) VALUES ('${commentData.id}','${commentData.post_id}','${commentData.content}')`);
            }
            catch (err) {
                console.error(err);
            }
        }
        if (message.topic === types_1.PREDICTIONS_TOPIC &&
            typeof message.value === "string") {
            const predictionData = JSON.parse(message.value);
            console.log(`RECEIVED PREDICTION ${JSON.stringify(predictionData)}`);
            try {
                // save comment prediction data in db
                dbClient.query(`INSERT INTO comments_predictions (comment_id, model_name, prediction, score) VALUES ('${predictionData.comment_id}','${predictionData.model_name}','${predictionData.prediction}','${predictionData.score}')`);
            }
            catch (err) {
                console.error(err);
            }
        }
    }
    catch (err) {
        console.error(err);
    }
});
//# sourceMappingURL=backend.js.map