export interface MetricsInterface {
    totalNrVotes: number;
    totalNrQuestions: number;
    totalNrAnswears: number;
    totalNrUsers: number;
    avgAnswearsPerUser: number;
    avgVotesPerUser: number;
    avgQuestionsPerUser: number;
    mostPopularDayOfTheWeekBasedOnVotes: string;
}