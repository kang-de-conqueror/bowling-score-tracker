import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Game } from '../games/game.entity';
import { Frame } from '../frames/frame.entity';

@Entity()
export class Player {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToMany(() => Game, (game) => game.players, { cascade: true })
    @JoinTable()
    games: Game[];

    @OneToMany(() => Frame, (frame) => frame.player, { cascade: true })
    frames: Frame[];
}
