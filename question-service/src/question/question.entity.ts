import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Vote } from '../vote/vote.entity';
import { Answear } from '../answear/answear.entity';

@Entity()
export class Question {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ type: 'text' })
    content: string;

    @Column()
    userId: string;

    @OneToMany(() => Answear, (answear) => answear.question, { cascade: true })
    answears: Answear[];

    @OneToMany(() => Vote, (vote) => vote.question, { cascade: true })
    votes: Vote[];
}