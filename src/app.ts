import express from "express";
import { KafkaClient, Producer } from "kafka-node";
import { COMMENTS_TOPIC, IComment } from "./types";

const kafkaClient = new KafkaClient({ kafkaHost: "desktop-pc:9092" });
const producer = new Producer(kafkaClient);

const app = express();
const port = 3000;

// parse request body as json
app.use(express.json());

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.post("/comment", (req, res) => {
	const commentData: IComment = req.body;
	const stringifiedComment = JSON.stringify(commentData);
	console.log(`GOT ${stringifiedComment}`);
	producer.send(
		[{ topic: COMMENTS_TOPIC, messages: stringifiedComment }],
		(err, data) => {}
	);
	console.log("SENT");
	res.send("DONE");
});

app.listen(port, () => {
	return console.log(`Express is listening at http://localhost:${port}`);
});
