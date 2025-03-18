import { VoteInterface } from "src/vote/interfaces/voteInterface.interface";
import { AnswerInterface } from "./answearInterface.interface";

export interface QuestionInterface {
    id?: string;
    content: string;
    userId: string;
    nrOfPositiveVotes?: number;
    nrOfNegativeVotes?: number;
    answears?: AnswerInterface[];
    createdAt?: Date;
    updatedAt?: Date;
    nrOfAnswers?: number;
}