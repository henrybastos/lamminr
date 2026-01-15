import { Module } from "@nestjs/common";
import { EventsGateway } from "./events.gateway";
import { OperationsService } from "./operations.service";

@Module({
  providers: [EventsGateway, OperationsService]
})

export class AppModule {};