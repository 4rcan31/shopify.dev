
import { Email } from "./app";
export class ServiceEmail{

    email;

    constructor(to, body, subject){
        console.log("Ejecutanto Service smtp...");
        this.email = new Email(to, body, subject, require("nodemailer"));
        this.email.setConfigNodeMailer(
            "smtp.gmail.com",
            587,
            "soporte_credisiman@consiti.com",
            "Consiti2023",
            false
        );
    }

    send(){
        console.log("Enviando la data para que el driver lo envie...");
        return this.email.send();
    }
}