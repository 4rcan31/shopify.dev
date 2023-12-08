import {  ServiceEmail } from "../../utils/emails/service";

export class AcountClient{

    payloadClient;
    email;
    id;
    first_name;
    last_name;
    phone;

    constructor(payloadClient){
        this.payloadClient = payloadClient;
        this.email = payloadClient.email;
        this.id = payloadClient.id;
        this.first_name = payloadClient.first_name;
        this.last_name = payloadClient.last_name;
        this.phone = payloadClient.phone;
    }


    async sendWelcomeEmailClient(){
        console.log("Entradooooo");
        const path = require('path');
        const fs = require('fs');
        const handlebars = require('handlebars');
  /*       const puppeteer = require('puppeteer'); */


        const source = path.join(__dirname, '../utils/emails/templates/welcome.hbs', 'utf8');
        const template = handlebars.compile(source);
        const data = {
            first_name: this.first_name,
            last_name: this.last_name,
          }; 
        const html = template(data); 

       /*  const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(html);
        await page.pdf({ path: 'welcome_email.pdf' });
    
        await browser.close(); */
        const serviceEmail = new ServiceEmail(
            this.email,
            html, //aca quiero que pongas el pdf, como lo haces?
            "Bienvenido a nuestra tienda!"
        );
        serviceEmail.send();
        console.log("Me ejecute papi");
    }


}