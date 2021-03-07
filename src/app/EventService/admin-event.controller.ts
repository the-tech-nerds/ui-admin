import { Controller, Get} from "@nestjs/common";
import {Client, ClientKafka, Transport} from "@nestjs/microservices";

@Controller('/api/event')
export default class AdminEventController {
    @Client({
        transport: Transport.KAFKA,
        options: {
            client: {
                clientId: 'products',
                brokers: ['localhost:9092'],
            },
            consumer: {
                groupId: 'kfc-stream',
            },
        },
    })
    client: ClientKafka;

    async onModuleInit() {
        this.client.subscribeToResponseOf('add.new.products');
        this.client.subscribeToResponseOf('get.products.list');

        await this.client.connect();
    }

    /*@Post('/')
    // @ts-ignore
    add(@Body() post: any) {
        try {
            console.log(post);
            return this.client.send('add.new.products', post);
        } catch (e) {
            console.log(e);
        }
    }*/

    @Get('/')
    getList() {
        return JSON.stringify({key: 'a'});
        //return this.client.send('get.products.list', '');
    }
}
