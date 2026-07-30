import { Server, Socket } from "socket.io";

export function registerCallHandlers(
  io: Server,
  socket: Socket,
  userId: string,
) {
  socket.on("CALL_OFFER", ({ to, offer }) => {
    console.log(`Call offer from ${userId} to ${to}`);

    io.to(to).emit("CALL_OFFER", {
      from: userId,
      offer,
    });
  });

  socket.on("CALL_ANSWER", ({ to, answer }) => {
    console.log(`CALL answered by ${userId}`);

    io.to(to).emit("CALL_ANSWER", {
      from: userId,
      answer,
    });
  });

  socket.on("ICE_CANDIDATE", ({ to, candidate }) => {
    io.to(to).emit("ICE_CANDIDATE", {
      from: userId,
      candidate,
    });
  });

  socket.on("CALL_END", ({ to }) => {
    console.log(`Call ended by ${userId}`);

    io.to(to).emit("CALL_END", {
      from: userId,
    });
  });
}
