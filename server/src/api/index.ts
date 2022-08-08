import app from "./app"
import { PrismaClient } from "@prisma/client";
import { DatabaseConnectionError } from "../types";

app.listen(process.env.PORT, async () => {
  try {
    await new PrismaClient().$connect()
    console.log(`Listening on port ${ process.env.PORT }`)
  } catch (error) {
    throw new DatabaseConnectionError()
  }
});