import { useLoaderData, Link, useSubmit } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import {
    Card,
    Layout,
    Page,
    Text,
    BlockStack,
    TextField,
    Button
} from "@shopify/polaris";
import { useState } from "react";


import { ServiceEmail } from "../utils/emails/service";


// Importar los módulos necesarios, incluyendo nodemailer y la clase Email si están definidos en otro lugar

export async function action({ request }) {
    try {

        const formData = {
            ...Object.fromEntries(await request.formData())
        }
        const email = new ServiceEmail(
            formData.email,
            formData.body,
            formData.subject
        );

        const data = await email.send();

        console.log("Se envió la data:");
        console.log(formData);
        return data;
    } catch (error) {
        console.error("Error al enviar el correo:", error);
        throw new Error("Ocurrió un error al enviar el correo");
    }
}





export default function Index() {

    const [formState, setForm] = useState({
        email: "",
        body: "",
        subject: ""
    });
    const summit = useSubmit();



    function sendEmail() {
        summit({
            email: formState.email,
            body: formState.body,
            subject: formState.subject
        }, { method: 'POST' });
    }

    return (
        <Page>
            <ui-title-bar title="Email App">
            </ui-title-bar>
            <Layout>
                <Layout.Section>
                    <Card>
                        <BlockStack gap="500">
                            <Text as={"h2"} variant="headingLg">
                                Envío de Correos Electrónicos
                            </Text>

                            <TextField
                                id="Email"
                                helpText="Actualmente, la API de Shopify no proporciona información detallada de los clientes. Puedes usar información de órdenes, la cual ocasionalmente contiene datos de clientes relacionados."
                                label="Email"
                                labelHidden
                                required
                                placeholder="Email"
                                autoComplete="off"
                                value={formState.email}
                                onChange={
                                    (email) => setForm({ ...formState, email })
                                }
                            />


                            <TextField
                                id="subject"
                                helpText="Escribe el Asunto del mensaje"
                                label="Asunto"
                                labelHidden
                                placeholder="Asunto"
                                autoComplete="off"
                                required
                                value={formState.subject}
                                onChange={
                                    (subject) => setForm({ ...formState, subject })
                                }
                            />

                            <TextField
                                id="Body"
                                multiline={4}
                                helpText="Escribe el contenido del mensaje"
                                label="Cuerpo"
                                labelHidden
                                placeholder="Cuerpo"
                                autoComplete="off"
                                required
                                value={formState.body}
                                onChange={
                                    (body) => setForm({ ...formState, body })
                                }
                            />
                        </BlockStack>

                        <br /><Button variant="primary" onClick={sendEmail}>Enviar</Button>
                    </Card>

                </Layout.Section>
            </Layout>
        </Page>
    );
}
