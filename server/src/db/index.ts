import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import { config } from "../utils/env.js";
import * as schema from "./schema/index.js";

const sql = neon(config.databaseUrl);
export const db = drizzle({ client: sql, schema });
