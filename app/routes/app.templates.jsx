
import { json } from "@remix-run/node";
import { useLoaderData, Link, useNavigate } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import {
  Card,
  EmptyState,
  Layout,
  Page,
  IndexTable,
  Thumbnail,
  Text,
  Icon,
  InlineStack,
  Box,
  List,
  BlockStack,
} from "@shopify/polaris";

import { getEmailTemplates } from "../models/EmailTemplate";
import { DiamondAlertMajor, ImageMajor } from "@shopify/polaris-icons";

export async function loader({ request }) {
  const { admin, session } = await authenticate.admin(request);
  const templates = await getEmailTemplates();

  return json({
    templates,
  });
}

const EmptyTamplatesState = ({ onAction }) => (
  <EmptyState
    heading="Create Tamplate"
    action={{
      content: "Create Tamplate",
      onAction,
    }}
    image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
  >
    <p>Allow customers to modify their own templates.</p>
  </EmptyState>
);

function truncate(str, { length = 25 } = {}) {
  if (!str) return "";
  if (str.length <= length) return str;
  return str.slice(0, length) + "…";
}

const TamplatesTable = ({ templates }) => (
  <IndexTable
    resourceName={{
      singular: "Plantilla",
      plural: "Plantillas",
    }}
    itemCount={templates.length}
    headings={[
      { title: "id" },
      { title: "Template name" },
      { title: "Created At" },
    ]}
    selectable={false}
  >
    {templates.map((template) => (
      <QRTableRow key={template.id} template={template} />
    ))}
  </IndexTable>
);

const QRTableRow = ({ template }) => (
  <IndexTable.Row id={template.id} position={template.id}>
    <IndexTable.Cell>
      <Text tone="critical" as="span">
      {template.id}
      </Text>
    </IndexTable.Cell>
    <IndexTable.Cell>
      <Link to={`../template/${template.id}`}>{truncate(template.template_name)}</Link>
    </IndexTable.Cell>
    <IndexTable.Cell>
      {new Date(template.createdAt).toDateString()}
    </IndexTable.Cell>
  </IndexTable.Row>
);

export default function Index() {

  const { templates } = useLoaderData();
  const navigate = useNavigate();

  return (
    <Page>
      <ui-title-bar title="Email Tamplates">
        <button variant="primary" onClick={() => navigate("/app/template/new")}>
          Create new Template
        </button>
      </ui-title-bar>
      <Layout>
        <Layout.Section>
          <Card padding="0">
            {templates.length === 0 ? (
              <EmptyTamplatesState onAction={() => navigate("/app/template/new")} />
            ) : (
              <TamplatesTable templates={templates} />
            )}
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

function Code({ children }) {
  return (
    <Box
      as="span"
      padding="025"
      paddingInlineStart="100"
      paddingInlineEnd="100"
      background="bg-surface-active"
      borderWidth="025"
      borderColor="border"
      borderRadius="100"
    >
      <code>{children}</code>
    </Box>
  );
}
