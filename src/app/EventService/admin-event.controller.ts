import { Controller, Get,} from "@nestjs/common";
import {Client, Transport, ClientRMQ,} from "@nestjs/microservices";

@Controller('/api/event')
export default class AdminEventController {
    @Client({
        transport: Transport.RMQ,
        options: {
            urls: ['amqp://user:pass@localhost:5672/grocery'],
            queue: 'cats_queue',
            queueOptions: {
              durable: false
            },
          },
    })
    client: ClientRMQ;

    async onModuleInit() {
        // this.client.consumeChannel('')
        // this.client.subscribeToResponseOf('get.products.list');
        console.log('sdasdasd');
        // await this.client.connect();
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
        // return JSON.stringify({key: 'a'});
        console.log('here ');
        this.client.emit<any>('get.products.list', "New message");
        return 'message published';
    }
}
