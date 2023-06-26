import { IAddRoomDTO } from './dto/add-room.dto';
import { IRoomsRepository } from './rooms.repository.interface';
import { IRoomsService } from './rooms.service.interface';


export class RoomsService implements IRoomsService {
    constructor(private readonly roomsRepository: IRoomsRepository) {}

    public async getRoomsList() {
        return this.roomsRepository.find();
    }

    public async getRoomsItem(roomId: number) {
        return this.roomsRepository.findById(roomId);
    }

    public async createRoom(addRoomDto: IAddRoomDTO) { 
        const candidateRoom = await this.roomsRepository.findByName(addRoomDto.roomName);

        if (candidateRoom)
            return null;
            
        return this.roomsRepository.create(addRoomDto);
    }

}