import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import * as WebSocket from 'ws';

@WebSocketGateway(3001)
export class QuestionsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: WebSocket.Server;
    private clients: WebSocket[] = [];

    handleConnection(client: WebSocket) {
        console.log(`Client connected`);
        this.clients.push(client);

    }

    handleDisconnect(client: WebSocket) {
        console.log(`Client disconnected: ${client}`);
    }

    broadcast(event: string, data: any) {
        const message = JSON.stringify({ event, data });
        this.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    }

}