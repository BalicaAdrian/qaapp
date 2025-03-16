import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';

import { Vote } from '../vote/vote.entity';
import { Answear } from 'src/answear/answear.entity';

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
    userId: string; // Foreign key to User

    @OneToMany(() => Answear, (answear) => answear.question, { cascade: true })
    answears: Answear[];

    @OneToMany(() => Vote, (vote) => vote.question, { cascade: true })
    votes: Vote[];
}