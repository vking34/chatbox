import mongoose, { Schema } from "mongoose";
import { MessageSchema } from './message';


const RoomSchema: Schema = new mongoose.Schema(
    {
        _id: {
            type: String,
            required: [true, 'Room ID is required!']
        },
        type: String,
        creator: String,
        buyer: String,
        seller: String,
        buyer_last_message: MessageSchema,
        seller_last_message: MessageSchema,
        shop: Object,
        buyer_info: {
            name: String,
            avatar: String,
            phone_number: String,
            email: String
        },
        pinned_by_buyer: Date,
        pinned_by_seller: Date,
        // enable: {
        //      type: Boolean,
        //      default: true
        // },
        buyer_unseen_messages: {
            type: Number,
            default: 0
        },
        seller_unseen_messages: {
            type: Number,
            default: 0
        },
        buyer_deleted_at: Date,
        deleted_by_buyer: {
            type: Boolean,
            default: false
        },
        seller_deleted_at: Date,
        deleted_by_seller: {
            type: Boolean,
            default: false
        },
        blocked_by: String    // blocked if this field exists 
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);

export default mongoose.model('cz_rooms', RoomSchema);



