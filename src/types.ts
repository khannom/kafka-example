export const COMMENTS_TOPIC = "comments";
export const PREDICTIONS_TOPIC = "predictions";

export interface IComment {
	id: string;
	post_id: string;
	content: string;
}

export interface IPrediction {
	prediction: string;
	score: number;
}

export interface ICommentPrediction {
	comment_id: string;
	model_name: string;
	prediction: string;
	score: number;
}
