import { useLoaderData, Link } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import {
  Card,
  Layout,
  Page,
  Text,
  BlockStack,
  Bleed,
  Divider,
  InlineStack,
  List
} from "@shopify/polaris";

export async function loader({ request }) {
  const { admin, session } = await authenticate.admin(request);
  const shop = await admin.rest.resources.Shop.all({
    session: session,
  });

  if (shop && shop.data && shop.data.length > 0 && shop.data[0].shop_owner) {
    const ownerShop = shop.data[0].shop_owner;
    return ownerShop;
  } else {
    return "No pudimos saber tu nombre :(";
  }
}

export default function Index() {
  const owner = useLoaderData();

  // [START page]
  return (
    <Page>
      <ui-title-bar title="Inicio">
      </ui-title-bar>
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="500">
              <Text as={"h2"} variant="headingLg">
                ¡Bienvenido, {owner}!
              </Text>

              <p>
                Este proyecto es solo una práctica para aprender sobre las funcionalidades de la API de Shopify.
              </p>
            </BlockStack>

            <br /><Bleed marginInlineStart="200" marginInlineEnd="200">
              <Divider />
            </Bleed><br />


            <Text variant="headingMd" as="h6">
              Este proyecto cuenta con las siguientes funcionalidades:
            </Text><br />

            <InlineStack gap="500" align="space-between" blockAlign="start">
              <List type="bullet">
                <List.Item>
                  <Link to={'../app/qr'}>Aplicación para crear códigos QR de los productos</Link>
                </List.Item>
              </List>
            </InlineStack>

            <br /><p>
              Pronto habrá más funcionalidades para que puedas ponerlas a prueba.
            </p>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
