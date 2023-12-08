import { sendDataServer } from "../../utils/connect/server";
import { ServiceEmail } from "../../utils/emails/service";

export class AcountClient {

    payloadClient;
    email;
    id;
    first_name;
    last_name;
    phone;

    constructor(payloadClient) {
        console.log("Ejecutanto construtor account client...");
        this.payloadClient = payloadClient;
        this.email = payloadClient.email;
        this.id = payloadClient.id;
        this.first_name = payloadClient.first_name;
        this.last_name = payloadClient.last_name;
        this.phone = payloadClient.phone;
    }


    async sendWelcomeEmailClient() {
        console.log("Ejecutanto send Welcome Email Client...");
        const path = require('path');
        const fs = require('fs');
        const handlebars = require('handlebars');
        //esto esta asi, por que en realidad, la aplicacion se esta ejecutando en
        // build/index.js
        const filePath = path.resolve(__dirname, '../app/utils/emails/templates/welcome.hbs');
        const source = fs.readFileSync(filePath, 'utf8');
        const template = handlebars.compile(source);
        //se inyecta la data al template de hbs
        console.log("Renderizando templates welcome client...");
        const html = template({
            first_name: this.first_name,
            last_name: this.last_name,
        });
        const serviceEmail = new ServiceEmail(
            this.email,
            html,
            "Bienvenido a nuestra tienda!"
        );
        serviceEmail.send();
        const sendData =  new sendDataServer(
            this.payloadClient,
            "http://localhost:8081",
            "POST"
        );
        sendData.execute();
        console.log("Esta es la data devuelta: ");
        console.log(sendData.getResponse());
        console.log("Me ejecute papi");
    }


}