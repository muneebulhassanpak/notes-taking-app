"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const mongoose_1 = __importDefault(require("mongoose"));
const databaseconnection_1 = require("./config/databaseconnection");
const app = (0, express_1.default)();
app.use(express_1.default.json());
//Connnect to database
(0, databaseconnection_1.connectWithDatabase)();
app.use("/api/auth", auth_route_1.default);
app.use((err, req, res, next) => {
    const code = err.status || 500;
    return res.status(code).json({
        success: false,
        message: err.message || "Something went wrong",
        status: code,
    });
});
const PORT = process.env.PORT || 3000;
mongoose_1.default.connection.once("open", () => {
    app.listen(PORT, () => {
        console.log(`Server running on ${PORT}`);
    });
});
mongoose_1.default.connection.on("error", () => {
    console.log("Probably due to connection with the database server, Server closed");
    process.exit(1);
});
