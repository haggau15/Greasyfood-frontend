// backend/index.js
import express from "express";
import { CosmosClient } from "@azure/cosmos";

const app = express();
const port = 5000;

// Cosmos DB connection
const client = new CosmosClient(process.env.COSMOS_CONNECTION_STRING);
const database = client.database("greasecontainerdb");
const container = database.container("greasecontainer");

app.get("/api/items", async (req, res) => {
  try {
    const { resources } = await container.items.query("SELECT * FROM c").fetchAll();
    res.json(resources);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching items");
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));