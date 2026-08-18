import serverless from "serverless-http";
import { createApp } from "./app";

// Netlify preserves the public /api path through its function rewrite.
export const handler = serverless(createApp("/api"));
