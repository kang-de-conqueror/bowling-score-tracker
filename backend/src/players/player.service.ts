import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './player.entity';
import { CreatePlayerDto } from './dto/create-player.dto';

@Injectable()
export class PlayerService {
    constructor(@InjectRepository(Player) private playerRepo: Repository<Player>) { }

    async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
        const player = this.playerRepo.create(createPlayerDto);
        return this.playerRepo.save(player);
    }

    async findAll(): Promise<Player[]> {
        return this.playerRepo.find();
    }
}
