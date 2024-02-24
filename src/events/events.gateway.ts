import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { allowedOrigins } from "../main";
import { WsGuard } from "src/auth/ws-auth.guard";
import { UseGuards } from "@nestjs/common";

@WebSocketGateway({
  cors: {
    origin: allowedOrigins,
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  @UseGuards(WsGuard)
  @SubscribeMessage("test-socket")
  handleEvent(@MessageBody() data: string): string {
    console.log("socket-io > test-socket:", data);
    return "Message Received"; // respond to source
  }
}
