"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.pool = void 0;
var pg_1 = require("pg");
var node_postgres_1 = require("drizzle-orm/node-postgres");
var schema = require("@shared/schema");
var dotenv_1 = require("dotenv");
var url_1 = require("url");
var path_1 = require("path");
var path_2 = require("path");
// Load environment variables from .env file
var __filename = (0, url_1.fileURLToPath)(import.meta.url);
var __dirname = (0, path_2.dirname)(__filename);
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../.env') });
if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}
exports.pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
exports.db = (0, node_postgres_1.drizzle)(exports.pool, { schema: schema });
