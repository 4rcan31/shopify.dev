import db from "../db.server";

export async function getEmailTemplate(id) {
    const tamplate = await db.email_tamplate.findFirst({ where: { id } });

    if (!tamplate) {
        return null;
    }
    
    return {
      ...tamplate,
    };
}

export async function getEmailTemplates() {
    const templates = await db.email_tamplate.findMany({});
  
    if (templates.length === 0) return [];
  
    return Promise.all(
        templates.map((template) => template)
    );
  }


export function validateTemplate(data) {
  const errors = {};

  if (!data.template_name) {
    errors.template_name = "template_name is required";
  }

  if (!data.header) {
    errors.productId = "header is required";
  }

  if (!data.body) {
    errors.productId = "body is required";
  }

  if (!data.footer) {
    errors.productId = "footer is required";
  }

  if (Object.keys(errors).length) {
    return errors;
  }
}