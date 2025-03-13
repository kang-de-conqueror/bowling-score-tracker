import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Player } from '../players/player.entity';
import { Frame } from '../frames/frame.entity';

@Entity()
export class Game {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    isActive: boolean;

    @ManyToMany(() => Player, (player) => player.games)
    @JoinTable()
    players: Player[];

    @OneToMany(() => Frame, (frame) => frame.game)
    frames: Frame[];
}
