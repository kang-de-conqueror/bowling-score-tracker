import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Game } from '../games/game.entity';
import { Player } from '../players/player.entity';

@Entity()
export class Frame {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Game, (game) => game.frames, { onDelete: "CASCADE" })
    game: Game;

    @ManyToOne(() => Player, (player) => player.frames, { onDelete: "CASCADE" })
    player: Player;

    @Column()
    frameNumber: number;

    @Column({ type: 'text', nullable: true })
    firstRoll: string | null;

    @Column({ type: 'text', nullable: true })
    secondRoll: string | null;

    @Column({ type: 'text', nullable: true })
    bonusRoll: string | null;
}
