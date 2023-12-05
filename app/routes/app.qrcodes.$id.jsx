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

//llamar las funciones para obtener los qr de la base de datos
import { getQRCode, validateQRCode } from "../models/QRCode.server";


//este loader se ocupa para traer data y renderizarla luego 
// dentro de la app, es una fucionalidad del propio remix
// ya que este framework rederiza los componentes en el servidor
export async function loader({ request, params }) {

  //justamente en "params", vienen las variables que se pasen
  //por la url, ya que ese archivo se llama: app.qrcodes.$id.jsx
  //esto significa que la url sera: app/qrcodes/{id}, donde id es un
  //parametro pasado por la url

  //autetica al admin para renderizar vista dentro del panel
  // de admin de shopify de la tienda
  const { admin } = await authenticate.admin(request);
  





  //si la request viene con un "new", significa que se va a crear
  //un nuevo qr
  if (params.id === "new") {
    //no entiendo por que retorna ese json quemado
    return json({
      destination: "product",
      title: "",
    });
  }

  //si la request viene un parametro que no sea "new", significa
  // que se esta queriendo traer un qr por el id del qr
  // desde la base de datos y no desde la api (entiendo)
  return json(await getQRCode(Number(params.id), admin.graphql));
  //La verdad no se que es admin.graphql, entiendo que 
  //es una query graphql, admin es un objeto que se crea
  //al autetificar al adminsitrador en el panel admin de shopify
  //pero no se de donde es ni como se definio esa query de graphql

  //actualizacion: creo que admin.graphql no es una query, en verdad es un metodo
  //para ejecutar querys graphql para la api de shopify, ya que en el archivo
  // app/models/QRCode.server.js en la funcion supplementQRCode, se ejecuta
  // ese mismo metodo, y recibe como parametro justo una query graphl 
}

//esta funcion se ejecuta luego de hacer alguna accion en algun formulario
// o una llamada de cualquier cosa al hacer POST, PUT o DELETE, basicamente
// a diferencia que la funcion loader se ejecuta justamente cuando se le hace
// la peticion a la pagina visitada, es para cargar datos y el el futuro del
// programa renderizarlos, action se ejecuta despues para hacer como dice
// una "accion"
export async function action({ request, params }) {

  // la session (ahora no el admin, no se por que)
  const { session } = await authenticate.admin(request);

  //de la session saca el shop
  const { shop } = session;


  //se obtienen los datos del formulario
  /** @type {any} */
  const data = {
    ...Object.fromEntries(await request.formData()),
    shop, // no se por que tambien le pone lo de shop aca
  };


  // si la opcion es eliminar
  if (data.action === "delete") {
    //elimina el qr de la base de datos
    await db.qRCode.delete({ where: { id: Number(params.id) } });
    return redirect("/app"); // y redirecciona
  }


  //valida los datos del formulario
  const errors = validateQRCode(data);

  if (errors) { //si hay errores retorna un json con los errores
    return json({ errors }, { status: 422 });
  }


  //justo aca, se define si se va a crear o actualizar un nuevo qr
  const qrCode =
    params.id === "new" //verifica si en la url esta el param con valor 'new'
      ? await db.qRCode.create({ data }) //si esta en new, lo crea
      : await db.qRCode.update({ where: { id: Number(params.id) }, data }); // si no, lo actualiza

  //en los casos devuelve la fila del qr afectado

  // y por ultimo solamente redireccina con el nueo
  return redirect(`/app/qrcodes/${qrCode.id}`);
}

export default function QRCodeForm() {
 
  //obtiene los errores, esto supongo que cuando se ejecute
  //action, mientras no se ejecute action, solamente mandara un array vacio (creo)
  const errors = useActionData()?.errors || {};

  // obtiene el qr que se le paso por el parametro de la url
  // aca se obtienen los datos del qr al ejecutar el loader
  const qrCode = useLoaderData();


  //el parametro que recibe useState es el valor inicial
  // que se guarda en el primer indice que devuelve, el segundo
  // es una funcion para actualizar esa variable (el primer indice),
  // en este punto del programa  formState tiene los datos del qr pasado por el qr
  const [formState, setFormState] = useState(qrCode);

  //no se por que hace lo mismo otra vez
  const [cleanFormState, setCleanFormState] = useState(qrCode);

  // y no se por que valida esto, si es la misma data segun yo
  const isDirty = JSON.stringify(formState) !== JSON.stringify(cleanFormState);


  //no se que devuelve nav, se supone que useNavigation, es 
  //una funcion de Remix
  const nav = useNavigation();




  // no entiendo muy bien esto, pero hasta ahorita entiendo que
  // solamente captura estos (data) de algun request ejecutado (usualmente o siempre)
  // desde un formulario 
  const isSaving = // guarda si el estado ha sido clickeado y ademas que no a sido eliminado, por lo tanto ha sido guardado
    nav.state === "submitting" && nav.formData?.get("action") !== "delete";
  const isDeleting = // guarda si el estado ha siado clickeado y ademas que a sido eliminado
    nav.state === "submitting" && nav.formData?.get("action") === "delete";


  //esto es una funcion para redireccionar, hasta ahora, lo entiendo asi xd
  const navigate = useNavigate();

  async function selectProduct() {

    //no se si esto ya es una peticion a la api para traerse los productos xd
    //creo que esto no es una peticion a la api, mas bien, es solamente
    // una seleccion a las vistas

    //update: de hecho, creo, que esta madre es el modal que se abre XD
    //pero no entiendo de donde madres se trae todos los productos
    const products = await window.shopify.resourcePicker({
      type: "product",
      action: "select", // customized action verb, either 'select' or 'add',
    });




    // si hay productos (creo que aca solamente setea si hay productos seleccionados)
    if (products) {
      //selecciona esa data del array products[0]
      const { images, id, variants, title, handle } = products[0];


      //setea el form que fue declarado mas arriba en useStade,
      // y ahora esta guardado en formState
      setFormState({
        ...formState, //hace merge con lo que tenia formState y lo demas
        productId: id,
        productVariantId: variants[0].id,
        productTitle: title,
        productHandle: handle,
        productAlt: images[0]?.altText,
        productImage: images[0]?.originalSrc,
      });
    }
  }

  //esto sumit es para enviar un formulario
  const submit = useSubmit();


  function handleSave() {

    // formState tendra la data de qrCode o cuando se ejecute setFormState (lo que salga)
    const data = {
      title: formState.title,
      productId: formState.productId || "",
      productVariantId: formState.productVariantId || "",
      productHandle: formState.productHandle || "",
      destination: formState.destination,
    };

    // pues supongo que el form se limpia, no se xd
    setCleanFormState({ ...formState });

    //la data se envia, con metodo post
    submit(data, { method: "post" });
  }

  return (
    <Page>

      {/* Esto solamen te es una guia que sale ahi arriba XD, como
      las de las carpetas */}
      <ui-title-bar title={qrCode.id ? "Edit QR code" : "Create new QR code"}>
        <button variant="breadcrumb" onClick={() => navigate("/app")}>
          QR codes
        </button>
      </ui-title-bar>


      <Layout>



        <Layout.Section>
          <BlockStack gap="500">



            {/* 
              No entiendo por que esta carta no se renderiza siempre, 
              si nunca veo una condicion para que esta carta se renderice,
              pero no se renderiza en "qr codes", donde esta la tabla
            */}
            <Card>
              <BlockStack gap="500">
                <Text as={"h2"} variant="headingLg">
                  Title
                </Text>

                <TextField
                  id="title"
                  helpText="Only store staff can see this title"
                  label="Title"
                  labelHidden
                  autoComplete="off"
                  value={formState.title}
                  onChange={(title) => setFormState({ ...formState, title })}
                  error={errors.title}
                />

              </BlockStack>
            </Card>



            <Card>
              <BlockStack gap="500">


                <InlineStack align="space-between">

                  {/* Esto es no mas el titulo que aparece */}
                  <Text as={"h2"} variant="headingLg">
                    Product
                  </Text>

                  {/* 
                    rederiza con condicion por si esta viendo un prouducto
                    ya existente, o esta creando un producto
                  */}
                  {formState.productId ? (
                    <Button variant="plain" onClick={selectProduct}>
                      Change product
                    </Button>
                  ) : null}
                </InlineStack>

                
                {/* 
                  Si esta revisando un producto y no solamente esta creando uno
                  por renderiza el producto con su imagen
                */}
                {formState.productId ? (
                  <InlineStack blockAlign="center" gap="500">
                    <Thumbnail
                      source={formState.productImage || ImageMajor}
                      alt={formState.productAlt}
                    />
                    <Text as="span" variant="headingMd" fontWeight="semibold">
                      {formState.productTitle}
                    </Text>
                  </InlineStack>
                ) : (
                  <BlockStack gap="200">

                    {/* 
                      Justo aca es donde se preciona el boton para abrir el modal
                      para seleccionar el producto, pero no entiendo muy bien como lo hace
                      (para poderlo replicar), aunque eso creo que es mas wea
                      de polaris y react xd 
                    */}
                    <Button onClick={selectProduct} id="select-product">
                      Select product
                    </Button>
                    {/* por si hay algun error supongo */}
                    {errors.productId ? (
                      <InlineError
                        message={errors.productId}
                        fieldID="myFieldID"
                      />
                    ) : null}
                  </BlockStack>
                )}




                {/* 
                  Esto no es mas que un divider, solamente es un hr
                */}
                <Bleed marginInlineStart="200" marginInlineEnd="200">
                  <Divider />
                </Bleed>




                <InlineStack gap="500" align="space-between" blockAlign="start">


                  {/* Esto es una lista, justamente la lista que aparece abajo
                      de la carta con titulo "product" */}
                  <ChoiceList
                    title="Scan destination"
                    choices={[ /* Valores a elegir */
                      { label: "Link to product page", 
                        value: "product" },
                      {
                        label: "Link to checkout page with product in the cart",
                        value: "cart",
                      },
                    ]}

                     /* No se muy bien para que es este atributo */
                    selected={[formState.destination]}

                     /* No entiendo muy bien a que se refiere destination
                        en este contexto, pero esta funcion onChange detecta el cambio
                        de la seleccion y actualiza el formState que se definio arriba*/
                    onChange={(destination) =>
                      setFormState({
                        ...formState,
                        destination: destination[0],
                      })
                    }
                    /* en el caso que exista error, lo guarda en el array de errores */
                    error={errors.destination} 
                  />

                  
                  {/* 
                    valida si es un qr de un producto o va a crear uno
                    dependiendo de eso, crea un nuevo enlace que va hacia la 
                    tienda real 
                  */}
                  {qrCode.destinationUrl ? (
                    <Button
                      variant="plain"
                      url={qrCode.destinationUrl}
                      target="_blank"
                    >
                      Go to destination URL
                    </Button>
                  ) : null}
                </InlineStack>



              </BlockStack>
            </Card>

          </BlockStack>
        </Layout.Section>



        <Layout.Section variant="oneThird">
          <Card>
            <Text as={"h2"} variant="headingLg">
              QR code
            </Text>

            {/* 
              Justamente aca en el codigo original hay un bug, ya que en qrCode
              tiene esta data si esta vacia: { destination: 'product', title: '' }

              si embargo hacer "qrCode ?" da true, ya que tiene datos
            */
                    console.log("aca data del qr", qrCode)
                    //console.log(qrCode)
            }

            {/* ahora poniendo le "qrCode.title ?"  en vez de solamente
                "qrCode ?" ya muestra el mensaje 
                "Your QR code will appear here after you save"
            */}
            {qrCode.title ? (
                <EmptyState image={qrCode.image} imageContained={true} />
            ) : (
              <EmptyState image="">
                Your QR code will appear here after you save
              </EmptyState>
            )}


            <BlockStack gap="300">

              {/* 
                Boton para Descarcar la imagen
                se desabilita cuando
                no hay ningun qr mostrandose
              */}
              <Button
                disabled={!qrCode?.image}
                url={qrCode?.image}
                download
                variant="primary"
              >
                Download
              </Button>


              {/* 
                Va hacia el archivo qrcodes.$id.jsx
                para mostrar el qr con el titulo
              */}
              <Button
                disabled={!qrCode.id}
                url={`/qrcodes/${qrCode.id}`}
                target="_blank"
              >
                Go to public URL
              </Button>
            </BlockStack>


          </Card>
        </Layout.Section>




        <Layout.Section>
          {/* 
            No entiendo muy bien esto, no se donde se renderizan 
            los componentes de los botones "Save" y "Delete",
            entiendo que esta parte es para eso, pero no lo 
            termino de comprender
          */}
          <PageActions
            secondaryActions={[
              {
                content: "Delete",
                loading: isDeleting,
                disabled: !qrCode.id || !qrCode || isSaving || isDeleting,
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