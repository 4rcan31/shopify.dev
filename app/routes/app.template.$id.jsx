import { useState } from "react";
import { json, redirect } from "@remix-run/node";
import {
  useActionData,
  useLoaderData,
  useNavigation,
  useSubmit,
  useNavigate,
} from "@remix-run/react";
import { authenticate } from "../shopify.server";
import {
  Card,
  Bleed,
  Button,
  ChoiceList,
  Divider,
  EmptyState,
  InlineStack,
  InlineError,
  Layout,
  Page,
  Text,
  TextField,
  Thumbnail,
  BlockStack,
  PageActions,
} from "@shopify/polaris";
import { ImageMajor } from "@shopify/polaris-icons";

import db from "../db.server";
import { getEmailTemplate, validateTemplate } from "../models/EmailTemplate";
import { ConsoleMessage } from "puppeteer";

export async function loader({ request, params }) {
    const { admin } = await authenticate.admin(request);
  
    if (params.id === "new") {
      return json({
        //destination: "product",
        template_name: "",
      });
    }
    
    return json(await getEmailTemplate(Number(params.id)));
  }




  export async function action({ request, params }) {
    const { session } = await authenticate.admin(request);
    const { shop } = session;
  
    /** @type {any} */
    const data = {
      ...Object.fromEntries(await request.formData(),
      shop)
    };
  
    if (data.action === "delete") {
      await db.email_tamplate.delete({ where: { id: Number(params.id) } });
      return redirect("/app/template");
    }
  
    const errors = validateTemplate(data);
  
    if (errors) {
      return json({ errors }, { status: 422 });
    }
  
    const email_tamplate =
      params.id === "new"
        ? await db.email_tamplate.create({ data })
        : await db.email_tamplate.update({ where: { id: Number(params.id) }, data });
  
    return redirect(`/app/templates`);
  }




  export default function TemplateForm() {
    const errors = useActionData()?.errors || {};
  
    const template = useLoaderData();
    const [formState, setFormState] = useState(template);
    const [cleanFormState, setCleanFormState] = useState(template);
    const isDirty = JSON.stringify(formState) !== JSON.stringify(cleanFormState);
    //console.log(formState);
    //console.log("template: "||template);
    const nav = useNavigation();
    const isSaving = nav.state === "submitting" && nav.formData?.get("action") !== "delete";
    const isDeleting = nav.state === "submitting" && nav.formData?.get("action") === "delete";

    const navigate = useNavigate();

  const submit = useSubmit();
  function handleSave() {
    const data = {
      template_name: formState.template_name || "C",
      header: "A",
      body: "B",
      footer: "C"
    };

    setCleanFormState({ ...formState });
    submit(data, { method: "post" });
  };



  return (
    <Page>
      <ui-title-bar title={template.id ? "Edit Template" : "Create template"}>
        <button variant="breadcrumb" onClick={() => navigate("/app")}>
          Template
        </button>
      </ui-title-bar>
      <Layout>
      <Layout.Section>
          <BlockStack gap="500">
            <Card>
              <BlockStack gap="500">
                <Text as={"h2"} variant="headingLg">
                  Nombre de plantilla
                </Text>
                {
                  console.log(formState)
                }
                {
                  console.log(formState.template_name)
                }
                <TextField
                  id="title"
                  helpText="Only store staff can see this title"
                  label="title"
                  labelHidden
                  autoComplete="off"
                  value={formState.template_name}
                  onChange={(template_name) => setFormState({ ...formState, template_name })}
                  error={errors.template_name}
                />
              </BlockStack>
            </Card>
            

          </BlockStack>
        </Layout.Section>
        
        <Layout.Section>
          <PageActions
            secondaryActions={[
              {
                content: "Delete",
                loading: isDeleting,
                disabled: !template.id || !template || isSaving || isDeleting,
                destructive: true,
                outline: true,
                onAction: () =>
                  submit({ action: "delete" }, { method: "post" }),
              },
            ]}
            primaryAction={{
              content: "Save",
              loading: isSaving,
              disabled: !isDirty || isSaving || isDeleting,
              onAction: handleSave,
            }}
          />
        </Layout.Section>
      </Layout>
    </Page>
  );
}