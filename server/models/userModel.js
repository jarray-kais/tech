import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        profilePicture : {type : String},
        Country : {type : String},
        telephone : {type : Number},
        resetToken : {type : String},
        isAdmin: { type: Boolean, default: false },
        isSeller: { type: Boolean, default: false },
        seller: {
            nameBrand: {type : String},
            Address : String ,
            logo: String,
            description: String,
            rating: { type: Number, default: 0, required: true },
            numReviews: { type: Number, default: 0, required: true },
        }
    },
    {
        timestamps: true // Ajoute automatiquement les champs createdAt et updatedAt
    }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;