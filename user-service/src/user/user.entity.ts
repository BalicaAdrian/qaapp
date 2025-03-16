import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 255 })
    name: string;

    @Column({ unique: true, length: 255 })
    email: string;

    @Column({ length: 255, nullable: true })
    oauthId?: string;
}