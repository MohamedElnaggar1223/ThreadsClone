import mongoose from 'mongoose'

const userThreadsSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: String,
    bio: String,
    threads: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Thread'
    }],
    onboarded: {
        type: Boolean,
        default: false
    },
    communities: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community'
    }],
})

const UserThread = mongoose.models.UserThread || mongoose.model('UserThread', userThreadsSchema)

export default UserThread