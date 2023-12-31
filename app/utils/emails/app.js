

export class Email{

    to;
    body;
    driver;

    from;
    subject;


    //nodemailer config
    transporter;

    constructor(to, body, subject, driver){
        console.log("Ejecutanto class para envios email...");
        this.to = to;
        this.body = body;
        this.subject = subject;
        this.driver = driver;
    }



    setConfigNodeMailer(host, port, user, pass, secure = true){ 
        if('createTransport' in this.driver){
            this.from = user;
            this.transporter = this.driver.createTransport({
                host: host,
                port: port,
                secure: secure,
                auth: {
                    user: user,
                    pass: pass
                } 
            });
        }else{
            console.error("El driver pasado no parece ser de nodeMailer, por que no se encuentra el metodo 'createTransport'"); 
        }
    }

    async send(){
        console.log("Enviando email to: " + this.to + "...");
        if('sendMail' in this.transporter){
            return await this.transporter.sendMail({
                from: this.from,
                to: this.to,
                subject: this.subject,
                html: this.body
            });
        }
    }

}