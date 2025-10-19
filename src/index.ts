import e from "express";
import { userRouter } from "./routes/user.js";
import { requestLogger } from "./middlewares/requestLogger.js";
import { connectDatabase } from "./db/client.js";
import { authRouter } from "./routes/auth.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { authorize } from "./middlewares/authorize.js";
import { UserRole } from "./enums/UserRole.js";

await connectDatabase();
const app = e();
const port = 3000;

app.use(e.json());
app.use(requestLogger);

app.use("/api/v1/users", authorize(), userRouter);
app.use("/api/v1/auth", authRouter);

app.use(errorHandler);
app.listen(port, () => {
	console.log(`Server started on http://localhost:${port}`);
})