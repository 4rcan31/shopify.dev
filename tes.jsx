import React from 'react';
import { useLoaderData } from '@remix-run/react';
import {
  Page,
  Layout,
  Card,
  BlockStack,
  IndexTable,
  Text,
} from '@shopify/polaris';

export const loader = async ({ request }) => {
const {admin, session} = await authenticate.admin(request);

  return json({
    productCount: await admin.rest.resources.Product.count({session}),
    products: await admin.rest.resources.Product.all({session}),
  });
};

export default function Index() {
  const { productCount, products } = useLoaderData();

  const rowMarkup = products.map((product) => (
    <IndexTable.Row key={product.id}>
      <IndexTable.Cell>{product.title}</IndexTable.Cell>
      <IndexTable.Cell>{product.vendor}</IndexTable.Cell>
      <IndexTable.Cell>{product.created_at}</IndexTable.Cell>
      {/* Agrega más celdas con los detalles que desees mostrar */}
    </IndexTable.Row>
  ));

  return (
    <Page>
      <BlockStack>
        <Layout>
          <Layout.Section>
            <Card>
              <IndexTable
                resourceName="Products"
                itemCount={products.length}
                headings={[
                  { title: 'Title' },
                  { title: 'Vendor' },
                  { title: 'Created At' },
                  {/* Agrega más títulos de columna según los detalles que quieras mostrar */}
                ]}
              >
                {rowMarkup}
              </IndexTable>
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
