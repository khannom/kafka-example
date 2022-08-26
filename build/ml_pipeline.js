"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kafka_node_1 = require("kafka-node");
const types_1 = require("./types");
const kafkaClient = new kafka_node_1.KafkaClient({ kafkaHost: "desktop-pc:9092" });
const commentsConsumer = new kafka_node_1.Consumer(kafkaClient, [{ topic: types_1.COMMENTS_TOPIC }], {});
const producer = new kafka_node_1.Producer(kafkaClient, {});
const happyKeywords = ["nice", "good"];
const sadKeywords = ["bad", "sad"];
const getSentimentPrediction = (text) => {
    if (happyKeywords.some((kw) => text.includes(kw))) {
        return { prediction: "happy", score: 0.9 };
    }
    else if (sadKeywords.some((kw) => text.includes(kw))) {
        return { prediction: "sad", score: 0.9 };
    }
    else {
        return { prediction: "unknown", score: 0.3 };
    }
};
commentsConsumer.on("message", function (message) {
    try {
        if (typeof message.value === "string") {
            const commentData = JSON.parse(message.value);
            console.log(`RECEIVED ${JSON.stringify(commentData)}`);
            try {
                // classify comments
                const sentimentPrediction = getSentimentPrediction(commentData.content);
                const predictionMsg = {
                    comment_id: commentData.id,
                    model_name: "sentiment",
                    prediction: sentimentPrediction.prediction,
                    score: sentimentPrediction.score,
                };
                producer.send([
                    {
                        topic: types_1.PREDICTIONS_TOPIC,
                        messages: JSON.stringify(predictionMsg),
                    },
                ], (err, data) => { });
                console.log("SENT");
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
//# sourceMappingURL=ml_pipeline.js.map