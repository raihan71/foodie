const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 12,
        unique: true,
        validate: {
            validator:
                (email) => {
                    const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
                    return regex.test(email);
                },
            message: '{VALUE} is invalid.'
        }
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    facebook: {
        id: String,
        token: String,
        name: String,
        email: String
    },
    dateJoined: {
        type: Date,
        default: Date.now,
        required: true
    }
}, { timestamps: true });

UserSchema.methods.passwordMatch = function (password, cb) {
    const user = this;

    bcrypt.compare(password, user.password, function (err, isMatch) {
        if (err) return cb(err);

        cb(null, isMatch);
    });
}

UserSchema.pre('save', function (next) {
    if (this.isNew || this.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(this.password, salt, (err, hash) => {
                this.password = hash;
                next();
            });
        })
    } else {
        next();
    }
});

module.exports = mongoose.model('User', UserSchema);