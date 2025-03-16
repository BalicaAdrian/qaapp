import { QuestionInterface } from "src/question/interfaces/questionInterface.interface";
import { VoteInterface } from "src/vote/interfaces/voteInterface.interface";

export interface AnswearInterface {
    id?: string;
    text: string;
    question?: QuestionInterface;
    questionId?: string,
    userId?: string;
    createdAt: Date;
    updatedAt: Date;
    votes?: VoteInterface[];
}
