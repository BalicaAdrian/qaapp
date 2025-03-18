import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { Question } from '../question/question.entity';
import { Answear } from '../answear/answear.entity';

@Entity()
export class Vote {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column()
    userId: string; 

    @Column({ default: true })
    isUpVote: boolean;

    @ManyToOne(() => Question, (question) => question.votes)
    @JoinColumn({ name: 'questionId' })
    question: Question;

    @ManyToOne(() => Answear, (answear) => answear.votes)
    @JoinColumn({ name: 'answearid' })
    answear: Answear;

}