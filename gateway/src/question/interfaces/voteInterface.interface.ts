export interface VoteInterface {
    id?: string;
    userId: string;
    questionId?: string;
    answearId?: string;
    isUpVote: boolean;
    createdAt: Date;
}