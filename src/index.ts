import e from "express";
import { userRouter } from "./routes/user.js";
import { requestLogger } from "./middlewares/request-logger.js";

const app = e();
const port = 3000;

app.use(e.json());
app.use(requestLogger);

app.use("/users", userRouter);

app.listen(port, () => {
	console.log(`Server started on http://localhost:${port}`);
})