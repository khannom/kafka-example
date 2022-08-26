import { KafkaClient, Consumer, Producer } from "kafka-node";
import {
	COMMENTS_TOPIC,
	IComment,
	ICommentPrediction,
	IPrediction,
	PREDICTIONS_TOPIC,
} from "./types";

const kafkaClient = new KafkaClient({ kafkaHost: "desktop-pc:9092" });

const commentsConsumer = new Consumer(
	kafkaClient,
	[{ topic: COMMENTS_TOPIC }],
	{}
);

const producer = new Producer(kafkaClient, {});

const happyKeywords = ["nice", "good"];
const sadKeywords = ["bad", "sad"];
const getSentimentPrediction = (text: string): IPrediction => {
	if (happyKeywords.some((kw) => text.includes(kw))) {
		return { prediction: "happy", score: 0.9 };
	} else if (sadKeywords.some((kw) => text.includes(kw))) {
		return { prediction: "sad", score: 0.9 };
	} else {
		return { prediction: "unknown", score: 0.3 };
	}
};

commentsConsumer.on("message", function (message) {
	try {
		if (typeof message.value === "string") {
			const commentData: IComment = JSON.parse(message.value);
			console.log(`RECEIVED ${JSON.stringify(commentData)}`);
			try {
				// classify comments
				const sentimentPrediction = getSentimentPrediction(
					commentData.content
				);
				const predictionMsg: ICommentPrediction = {
					comment_id: commentData.id,
					model_name: "sentiment",
					prediction: sentimentPrediction.prediction,
					score: sentimentPrediction.score,
				};
				producer.send(
					[
						{
							topic: PREDICTIONS_TOPIC,
							messages: JSON.stringify(predictionMsg),
						},
					],
					(err, data) => {}
				);
				console.log("SENT");
			} catch (err) {
				console.error(err);
			}
		}
	} catch (err) {
		console.error(err);
	}
});
