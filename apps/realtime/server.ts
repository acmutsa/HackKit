import { Server } from "socket.io";

const io = new Server({});

// io.on("connection", (socket) => {
// 	socket.on()
// });

io.listen(3000);
