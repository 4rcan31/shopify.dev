import { useLoaderData, Link, useSubmit } from "@remix-run/react";
import {
    Card,
    Layout,
    Page,
    Text,
    BlockStack,
    TextField,
    Button,
    Select
} from "@shopify/polaris";
import { useState, useCallback } from "react";


import { ServiceEmail } from "../utils/emails/service";
import {VanillaRender, WelcomeRender, DataLogRender}  from "../components/templatesEmail";
import { AcountClient } from "../controllers/webhooks/createClient";



/* export async function loader({request}){
    //const { admin } = await authenticate.admin(request);

    //return admin.graphql;
} */

export async function action({ request }) {
    console.log("Algo entro en el action ");
    try {

        const formData = {
            ...Object.fromEntries(await request.formData())
        }
    

        if(formData.type == 'vanilla'){
            const email = new ServiceEmail(
                formData.email,
                formData.body,
                formData.subject
            );
            await email.send();
           
        }else if(formData.type == 'welcome'){
            
            const dataClient = await formData.graphql(`
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
              email: formData.email,
            },
          });

          console.log("Se ejecuto para enviar un welcome al cliente");
          console.log("Esta es la data: ");
          console.log(dataClient);
          

        /*     const clientWelcome = new AcountClient({
                email: formData.email,
                first_name: "Como madres consigo el primer nombre XD",
                last_name: "Como madres consido el apellido XD"
            });
            await clientWelcome.sendWelcomeEmailClient();
 */
            
        }else if(formData.type == 'datalog'){
            /* Implementar el envio del datalog */
        }else{
            console.log(`El formulario de tipo ${formData.type} no existe`);
            return null;
        }

        console.log(`El correo de tipo ${formData.type} fue enviado a ${formData.email}`);


        
        //envio la data del form, aun no se por que xd
        return formData;
    } catch (error) {
        console.error("Error al enviar el correo:", error);
        throw new Error("Ocurrió un error al enviar el correo");
    }
}





    export default function Index() {
        const graphql = useLoaderData();


        //aparecera por defecto el template de vanilla
        const [selected, setSelected] = useState('vanilla');

        const handleSelectChange = useCallback(
            (value) => setSelected(value),
            [],
        );

        const options = [
            { label: 'Vanilla', value: 'vanilla' },
            { label: 'Bienvenida', value: 'welcome' },
            { label: 'Auditoria personal de datos', value: 'dataLog' },
        ];
        



        return (
            <Page>
                <ui-title-bar title="Email App">
                </ui-title-bar>
                <Layout>
                    <Layout.Section>
                        <Card>
                            <Select
                                label="Elige la template para enviar"
                                options={options}
                                onChange={handleSelectChange}
                                value={selected}
                            />
                        </Card>
                    </Layout.Section>
                    <Layout.Section>
                        {selected === 'vanilla' && <VanillaRender />}
                        {selected === 'welcome' && <WelcomeRender graphql={graphql} />}
                        {selected === 'dataLog' && <DataLogRender />}
                    </Layout.Section>
                </Layout>
            </Page>
        );
    }
