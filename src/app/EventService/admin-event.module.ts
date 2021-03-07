import { Module } from '@nestjs/common';
import AdminEventController from "./admin-event.controller";

@Module({
    imports: [],
    controllers: [AdminEventController],
    providers: []
})
export class AdminEventModule {}
