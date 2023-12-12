import { useLoaderData, useSubmit } from "@remix-run/react";
import { BlockStack, Button, Card, TextField, Text } from "@shopify/polaris";
import React, { useState } from 'react';
import { authenticate } from "../shopify.server";




const VanillaRender = () => {


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
            subject: formState.subject,
            type: 'vanilla'
        }, { method: 'POST' });
    }


    return (
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
                    onChange={(email) => setForm({ ...formState, email })}
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
                    onChange={(subject) => setForm({ ...formState, subject })}
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
                    onChange={(body) => setForm({ ...formState, body })}
                />
            </BlockStack>

            <br />
            <Button variant="primary" onClick={sendEmail}>
                Enviar
            </Button>
        </Card>
    );
};


const WelcomeRender = ({ graphql }) => {



    const [formState, setForm] = useState({
        email: ""
    });

    const summit = useSubmit();

/*     const dataClient = graphql(`
    query customerByEmail($email: String!) {
      customers(first: 1, query: $email) {
        edges {
          node {
            id
            firstName
            lastName
            email
          }
        }
      }
    }
  `, {
        variables: {
            email: formState.email,
        },
    }); */

    function sendEmail() {
        summit({
            email: formState.email,
            type: 'welcome',
            dataClient : dataClient
        }, { method: 'POST' });
    }

    return (
        <Card>
            <BlockStack gap={500}>
                <Text as={"h2"} variant="headingLg">
                    Envío de Correo para bienvenida
                </Text>

                <TextField
                    id="Email"
                    helpText="Elige a quien le enviaras el email de bienvenida"
                    label="Email"
                    labelHidden
                    required
                    placeholder="Email"
                    autoComplete="off"
                    value={formState.email}
                    onChange={(email) => setForm({ ...formState, email })}
                />
            </BlockStack>
            <br />

            <Button variant="primary" onClick={sendEmail}>
                Enviar
            </Button>
        </Card>
    );
}


const DataLogRender = () => {

    const [formState, setForm] = useState({
        email: ""
    });

    function sendEmail() {
        summit({
            email: formState.email,
            type: 'datalog',
            graphql: useLoaderData()
        }, { method: 'POST' });
    }

    return (
        <Card>
            <BlockStack gap={500}>
                <Text as={"h2"} variant="headingLg">
                    Envío de Correo para una bitacora hacia el cliente
                </Text>

                <TextField
                    id="Email"
                    helpText="Elige a quien le enviaras la bitacora"
                    label="Email"
                    labelHidden
                    required
                    placeholder="Email"
                    autoComplete="off"
                    value={formState.email}
                    onChange={(email) => setForm({ ...formState, email })}
                />
            </BlockStack>
            <br />

            <Button variant="primary" onClick={sendEmail}>
                Enviar
            </Button>
        </Card>
    );
}

export { VanillaRender, WelcomeRender, DataLogRender };
