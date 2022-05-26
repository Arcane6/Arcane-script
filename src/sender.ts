import parsePhoneNumber, { isValidPhoneNumber } from "libphonenumber-js"
import {create, Whatsapp, Message, SocketState } from "venom-bot"
const venom = require('venom-bot');


// criando o tipo QRCODE

export type QRCode = {
    base64Qr: string
}


// CRIANDO A CLASSE SENDER
class Sender 
{
    // CRIANDO OS ATRIBUTOS DA CLASSE
    private client: Whatsapp
    private isConnected: boolean;
    private qr: QRCode

    //CONSTRUINDO OS METODOS DA CLASSE
    get connected(): boolean
    {
        return this.isConnected;
    }

    get qrCode(): QRCode
    {
        return this.qr;
    }

    //INICIALIZANDO UM METODO DENTRO DA INSTANCIA
    constructor() 
    {
        this.initialize()
    }
    //CRIANDO O METODO DE ENVIAR MENSAGEM DE FORMA ASSINCRONA
    async sendText(to: string, body: string)
    {
        //SE O NUMERO NÃO FOR VALIDO NO FORMATO PT-BR
        if(!isValidPhoneNumber(to, "BR"))
        {
            //SERÁ LEVANTADO UM ERRO INDICANDO ISSO
            throw new Error('Esse numero não é válido!')
        }

        // VARIAVEL QUE ARMAZENA O NUMERO E FORMATA ELE
        let phoneNumber = parsePhoneNumber(to, "BR")
        //FORMATA PARA ISO DO BRASIL(+55)
        ?.format("E.164")
        //REMOVE O + PARA O WPP CONSEGUIR ENVIARA MSG
        ?.replace('+','') as string
        //ADICIONA NO NÚMERO O @C.US PARA CONSEGUIR ENVIAR A MSG
        phoneNumber = phoneNumber.includes("@c.us") 
        ? phoneNumber
        : `${phoneNumber}@c.us`
        //PRINTA O NÚMERO DO TELEFONE
        console.log("phoneNumber",phoneNumber)
        //this.sendText('5521982314899@c.us', "Olá tudo bem? esse é um teste")
       //DISPARA A MENSAGEM QUANDO O MÉTODO É CHAMADO
        await this.client.sendText(phoneNumber,body)
    }

    //METODO DE INICIALIZAÇÃO DA INSTÂNCIA DO VENOM
    private initialize() 
    
    {
        //CODIGO QR
        const qr = (base64Qr: string) => {
            this.qr = { base64Qr }
        }
        //STATUS DO SERVIÇO
        const status = (statusSession: string) => {
            this.isConnected = ['isLogged', 'qrReadSuccess','chatsAvailable'].includes(
                statusSession
            )
        }
        //COMEÇA A CONEXÃO
        const start = (client: Whatsapp) =>
        {
            this.client = client;
            //VERIFICAR SE A CONEXÃO ESTÁ SEMPRE ATIVA
            client.onStateChange((state) => {
                this.isConnected = state === SocketState.CONNECTED
            })

            
        }
        //ATRIBUTOS DE INICIALIZAÇÃO SESSÃO
  create('Nome_sessão',status)
  .then((client) => start(client))
  .catch((erro) => {
    console.log(erro);
  });
}
}

//EXPORTAÇÃO DA CLASSE PARA O SERVIDOR
export default Sender 


