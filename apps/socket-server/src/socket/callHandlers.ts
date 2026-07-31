import { Server, Socket } from "socket.io";

const activeCalls = new Set<string>();

export function registerCallHandlers(
  io: Server,
  socket: Socket,
  userId: string,
) {
  socket.on("CALL_OFFER", ({ to, offer, caller }) => {
    console.log(`Call offer from ${userId} to ${to}`);

    // Busy check
    if (activeCalls.has(to)) {
      socket.emit("CALL_BUSY", {
        userId: to,
      });

      return;
    }

    io.to(to).emit("CALL_OFFER", {
      from: userId,
      offer,
      caller,
    });
  });

  socket.on("CALL_ANSWER", ({ to, answer }) => {
    console.log(`CALL answered by ${userId}`);

    activeCalls.add(userId);
    activeCalls.add(to);

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

    activeCalls.delete(userId);
    activeCalls.delete(to);

    io.to(to).emit("CALL_END", {
      from: userId,
    });
  });

  socket.on("CALL_REJECT", ({ to }) => {
    console.log(`${userId} rejected the call`);

    io.to(to).emit("CALL_REJECT", {
      from: userId,
    });
  });
}
