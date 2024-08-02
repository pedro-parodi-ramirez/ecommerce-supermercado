import app from "./app.js";
import { initSocket } from "./socket.js";

const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
    console.log(`Servidor http esta escuchando en el puerto ${server.address().port}`);
    console.log(`http://localhost:${server.address().port}`);
});
server.on("error", error => console.log(`Error en servidor ${error}`));
initSocket(server);