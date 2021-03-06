import { Server, Socket } from "socket.io";
import { MessageFormat } from '../../interfaces/message';
import cuid from 'cuid';
import { messengerNamespace } from '../index';

// models
import { MessageModel } from '../../models/message';
import RoomModel from '../../models/room';

const NEW_MESSAGE_EVENT = 'new_message';
export default (_io: Server, socket: Socket) => {
    socket.on(NEW_MESSAGE_EVENT, (msg: MessageFormat) => {
        const { from, to } = msg;
        msg._id = cuid();   // generate message id
        msg.created_at = new Date().toISOString();

        messengerNamespace.in(from).emit(NEW_MESSAGE_EVENT, msg);
        messengerNamespace.in(to).emit(NEW_MESSAGE_EVENT, msg);

        msg.updated_at = msg.created_at;
        msg.is_seen = false;
        // console.log(NEW_MESSAGE_EVENT, msg);
        MessageModel
            .create(msg)
            .then(message => {
                RoomModel.findById(msg.room_id, (_e, room: any) => {
                    if (room) {
                        if (to === room.seller) {
                            room.seller_unseen_messages++;
                        }
                        else {
                            room.buyer_unseen_messages++;
                        }

                        // if (!room?.deleted_by_buyer)
                        //     room.buyer_last_message = message;
                        // if (!room?.deleted_by_seller)
                        //     room.seller_last_message = message;

                        room.buyer_last_message = message;
                        room.seller_last_message = message;
                        room.save();
                    }
                }).catch(_e => { console.log(_e); });
            })
            .catch((_e) => { console.log(_e) });
    });
}