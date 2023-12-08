

export class sendDataServer {


  constructor(data, server, method) {
    console.log("Ejecutanto contructor para hacer peticion...");
    this.response = null;
    this.error = null;
    this.axios = require('axios');
    this.data = data;
    this.server = server;
    this.method = method;
  }

  execute() {

    
    console.log("Ejecutanto ejecutador para llamada de la api...");
    this.axios({
      method: this.method,
      url: this.server,
      headers: {
        'Content-Type': 'application/json',
        'Accept-Encoding' : 'gzip, deflate, br',
        'Connection' : 'keep-alive'
      },
      data: JSON.stringify(this.data)
    })
      .then(response => {
        console.log("Obteniendo respuesta de la api...");
        console.log(response.data);
        this.response = response.data;
      })
      .catch(error => {
        console.log("Error en la llamada de la api...");
        if (error.response) {
          // La solicitud fue realizada y el servidor respondió con un código de estado fuera del rango 2xx
          console.log("Respuesta del servidor:", error.response.data);
          console.log("Código de estado HTTP:", error.response.status);
          console.log("Encabezados de respuesta:", error.response.headers);
        } else if (error.request) {
          // La solicitud fue realizada pero no se recibió respuesta
          console.log("La solicitud fue realizada pero no se recibió respuesta:", error.request);
        } else {
          // Algo sucedió al configurar la solicitud y se generó el error
          console.log("Error al configurar la solicitud:", error.message);
        }
       // console.log("Error completo:", error);
        this.error = error;
      });
  }


  getResponse() {
    return this.response;
  }

  isError() {
    return this.error != null;
  }

  getError() {
    return this.error;
  }
}
