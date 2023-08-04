const express = require("express")
const cookieParser = require("cookie-parser");
const cors = require("cors");
const database = require("./config/database");
require("dotenv").config();

// importing Environment Variables
const PORT = process.env.PORT || 3000;

//connect to database
database.connect();

//create express app
const app = express();

//creating http server with express app
const httpServer = require('http').createServer(app);

//creating io server
const io = require('socket.io')(httpServer, {
    cors: {
        origin: "*",
        credentials: true
    }
})

//apply middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: "*",
        credentials: true
    })
);
// Attach the Socket.io instance to Express request object
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Socket.io setup
io.on('connection', (socket) => {
    console.log(`User connected with socketId: ${socket.id}`);

    socket.on('disconnect', () => {
        console.log('A user disconnected.');
    });

    socket.on("hello", (arg) => {
        console.log(arg); // world
    });
});

//importing routes
const userRoute = require("./routes/userRoute");
const pollsRoute = require("./routes/pollsRoute");

//mounting routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/polls", pollsRoute);

//default route
app.get('/', (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Server up and running..."
    })
})


//running the server
httpServer.listen(PORT, () => {
    console.log(`Server Started Successfully.`);
    console.log(`Listening at port: ${PORT}`);
})

