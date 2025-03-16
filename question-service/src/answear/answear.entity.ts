import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Question } from '../question/question.entity';
import { Vote } from '../vote/vote.entity';

@Entity()
export class Answear {
@PrimaryGeneratedColumn('uuid')
id: string;

@CreateDateColumn()
createdAt: Date;

@UpdateDateColumn()
updatedAt: Date;

@Column({ type: 'text' })
text: string;

@Column()
userId: string; // Foreign key to User

@ManyToOne(() => Question, (question) => question.answears)
@JoinColumn({ name: 'questionId' })
question: Question;

@OneToMany(() => Vote, (vote) => vote.answear) // Add this line
votes: Vote[];
}