import { IComment } from "./types";
import axios from "axios";

const commentList = [
	"good morning!",
	"nice day",
	"sad daaay",
	"bad job",
	"hello world",
];

const requestLoop = setInterval(async () => {
	try {
		const commentData: IComment = {
			id: new Date().getTime().toString(),
			post_id: "111",
			content:
				commentList[Math.floor(Math.random() * commentList.length)],
		};
		await axios.post("http://desktop-pc:3000/comment", commentData, {
			headers: {
				"Content-type": "application/json; charset=UTF-8",
			},
		});
	} catch (err) {
		console.error(err);
	}
}, 10);
