import { AnswearInterface } from "./answearInterface.dto";

export interface QuestionInterface {
    id?: string;
    content: string;
    userId: string;
    nrOfPositiveVotes?: number;
    nrOfNegativeVotes?: number;
    answers?: AnswearInterface[];
    createdAt?: Date;
    updatedAt?: Date;
    nrOfAnswers?: number;
}