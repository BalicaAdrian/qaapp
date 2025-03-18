export interface AnswerInterface {
    id: string;
    text: string;
    questionId?: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    nrOfPositiveVotes?: number;
    nrOfNegativeVotes?: number;
  }