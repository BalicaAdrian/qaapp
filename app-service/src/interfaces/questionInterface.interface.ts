import { AnswearInterface } from "./answerInterface.interface";

export interface QuestionInterface {
  id?: string;
  content: string;
  userId: string;
  nrOfPositiveVotes?: number;
  nrOfnegativeVotes?: number;
  answers?: AnswearInterface[];
  createdAt?: Date;
  updatedAt?: Date;
  nrOfAnswers?: number;
}