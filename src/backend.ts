import { KafkaClient, Consumer, } from "kafka-node";
import { Client } from "node-postgres";
import {
	COMMENTS_TOPIC,
	IComment,
	ICommentPrediction,
	PREDICTIONS_TOPIC,
} from "./types";

const dbClient = new Client({
	user: "admin",
	host: "desktop-pc",
	database: "kafka-example-db",
	password: "postgres",
	port: 5432,
});
dbClient.connect();

const kafkaClient = new KafkaClient({ kafkaHost: "desktop-pc:9092" });

const consumers = new Consumer(
	kafkaClient,
	[{ topic: COMMENTS_TOPIC }, { topic: PREDICTIONS_TOPIC }],
	{}
);
consumers.on("message", function (message) {
	try {
		if (
			message.topic === COMMENTS_TOPIC &&
			typeof message.value === "string"
		) {
			const commentData: IComment = JSON.parse(message.value);
			console.log(`RECEIVED COMMENT ${JSON.stringify(commentData)}`);
			try {
				// save comment data in db
				dbClient.query(
					`INSERT INTO comments (id, post_id, content) VALUES ('${commentData.id}','${commentData.post_id}','${commentData.content}')`
				);
			} catch (err) {
				console.error(err);
			}
		}
		if (
			message.topic === PREDICTIONS_TOPIC &&
			typeof message.value === "string"
		) {
			const predictionData: ICommentPrediction = JSON.parse(
				message.value
			);
			console.log(
				`RECEIVED PREDICTION ${JSON.stringify(predictionData)}`
			);
			try {
				// save comment prediction data in db
				dbClient.query(
					`INSERT INTO comments_predictions (comment_id, model_name, prediction, score) VALUES ('${predictionData.comment_id}','${predictionData.model_name}','${predictionData.prediction}','${predictionData.score}')`
				);
			} catch (err) {
				console.error(err);
			}
		}
	} catch (err) {
		console.error(err);
	}
});
