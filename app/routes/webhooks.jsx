import { authenticate } from "../shopify.server";
import db from "../db.server";
import { AcountClient } from "../controllers/webhooks/createClient";

export const action = async ({ request }) => {
  const { topic, shop, session, admin, payload } = await authenticate.webhook(
    request
  );

  if (!admin) {
    // The admin context isn't returned if the webhook fired after a shop was uninstalled.
    throw new Response();
  }

  switch (topic) {
    case "APP_UNINSTALLED":
      if (session) {
        await db.session.deleteMany({ where: { shop } });
      }

      break;
    case "CUSTOMERS_DATA_REQUEST":
      console.log("algo de los custmes data request paso, y no se que XD");
    case "CUSTOMERS_REDACT":
      console.log("algo de los CUSTOMERS_REDACT paso, y no se que XD");
    case "SHOP_REDACT":
      console.log("algo de los SHOP_REDACT paso, y no se que XD");
    case "PRODUCTS_UPDATE":
      console.log("updated desde la ruta");
      console.log(payload);
    case "CUSTOMERS_CREATE":
      console.log('yapa, si era eso xd');
      const client = new AcountClient(payload); //aca envio el correo
      client.sendWelcomeEmailClient();
    default:
      throw new Response("Unhandled webhook topic", { status: 404 });
  }

  throw new Response();
};
