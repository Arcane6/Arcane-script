import express, {Request, Response} from "express"
import Sender from "./sender"

//RECEBE A CLASSE SENDER
const sender = new Sender();

//INICIALIZA O MODULO DO EXPRESS
const app = express()

//SETANDO OS TIPOS DE ARQUIVOS QUE VAO SER EXECUTADOS
app.use(express.json())
app.use(express.urlencoded({ extended : false }))//METODO DE LEITURA COM O NAVEGADOR ABERTO OFF

// ROTA PARA LER O STATUS DO SERVIÇO
app.get('/status', (req: Request, res: Response) =>{
return res.send({
    qr_code: sender.qrCode,
    connected: sender.connected,
})
})

app.post('/send', async (req: Request, res: Response) =>{
    const { number, message} = req.body
    
    try
    {
        //validar e transformar o numero do wpp

   await sender.sendText(number, message)
   return res.status(200).json()
    }
    catch (error)
    {
        console.log("error",error)
        res.status(500).json({status:"error", message: error})
    }
})
//aplicativo rodando na porta 5000
app.listen(5000, () => {console.log('SERVIDOR DOS CRIAS ON 🐍🐍🐍🐍')})