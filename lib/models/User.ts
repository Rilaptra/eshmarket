import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: String,
    profileImage: String,
    role: String,
    isAdmin: Boolean,
    balance: {
        dl: Number,
        money: Number,
    },
    scriptBuyed: Array<String>,
    chart: Array<Object>,
})

export default mongoose.models.User || mongoose.model('User', UserSchema);