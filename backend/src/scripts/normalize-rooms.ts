import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { RoomsService } from '@modules/rooms/rooms.service';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { normalizeString } from '@common/utils/string.util';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const roomsService = app.get(RoomsService);
    const connection = app.get<Connection>(getConnectionToken());

    const roomModel = connection.model('Room');

    console.log('Start normalizing room names...');

    const rooms = await roomModel.find({});
    let count = 0;

    for (const room of rooms) {
        const nameNormalized = normalizeString(room.roomName);
        if (room.nameNormalized !== nameNormalized) {
            room.nameNormalized = nameNormalized;
            await room.save();
            count++;
            if (count % 100 === 0) {
                console.log(`Updated ${count} rooms...`);
            }
        }
    }

    console.log(`Finished! Updated ${count} rooms.`);
    await app.close();
}

bootstrap();
