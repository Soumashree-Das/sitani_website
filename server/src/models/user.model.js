
// // import mongoose from "mongoose";

// // const userSchema = new mongoose.Schema({
// //     name: {
// //         type: String,
// //         required: true
// //     },
// //     email: {
// //         type: String,
// //         required: true,
// //         unique: true 
// //     },
// //     password: {
// //         type: String,
// //         required: true,
// //         minlength: 6
// //     }
// // }, {
// //     timestamps: true
// // });

// // const User = mongoose.model("User", userSchema);

// // export default User;
// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true 
//     },
//     password: {
//         type: String,
//         required: true,
//         minlength: 6
//     },
//     profilePicture: {
//         publicId: {
//             type: String,
//             default: null
//         },
//         url: {
//             type: String,
//             default: null
//         }
//     },
//     refreshToken: {
//         type: String,
//         default: null
//     }
// }, {
//     timestamps: true
// });

// const User = mongoose.model("User", userSchema);

// export default User;
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true 
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    profilePicture: {
        type: String, // This will store the file path
        default: null
    },
    refreshToken: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

const User = mongoose.model("User", userSchema);

export default User;