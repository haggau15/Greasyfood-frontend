const { CosmosClient } = require("@azure/cosmos");

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const databaseId = "greasecontainerdb";
const containerId = "greasecontainer";

const client = new CosmosClient({ endpoint, key });

module.exports = async function (context, req) {
  try {
    console.log("yo");
    const { resources: items } = await client
      .database(databaseId)
      .container(containerId)
      .items.query("SELECT * FROM c")
      .fetchAll();

    context.res = {
      status: 200,
      body: items,
    };
  } catch (err) {
    context.res = {
      status: 500,
      body: `Error: ${err.message}`,
    };
  }
};