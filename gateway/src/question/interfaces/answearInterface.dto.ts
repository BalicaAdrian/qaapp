import { QuestionInterface } from "./questionInterface.dto";
import { VoteInterface } from "./voteInterface.interface";


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
