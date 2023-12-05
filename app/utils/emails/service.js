
import { Email } from "./app";
export class ServiceEmail{

    email;

    constructor(to, body, subject){
        const nodemailer = require("nodemailer");
        this.email = new Email(to, body, subject, nodemailer);
        this.email.setConfigNodeMailer(
            "smtp.gmail.com",
            587,
            "soporte_credisiman@consiti.com",
            "Consiti2023",
            false
        );
    }

    send(){
        return this.email.send();
    }
}