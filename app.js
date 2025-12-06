
import connect from "./db/database.js";
import express from "express"
import cors from "cors";
import userRoute from "./routes/user.route.js";
import contactRoute from "./routes/contact.route.js";
import messageRoute from "./routes/message.route.js";
import cookieParser from "cookie-parser";

connect();

const app=express()

app.use(cors({ origin: "https://chat-app-frontend-theta-two.vercel.app", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())
app.use(express.static("public"));

app.use("/user", userRoute);
app.use("/contact",contactRoute)
app.use("/api",messageRoute)


export default app

