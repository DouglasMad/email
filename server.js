const express = require("express");
const nodemailer = require("nodemailer");
const multer = require("multer");
const xlsx = require("xlsx");
const path = require("path");
const fs = require("fs");
const os = require('os');
const { exec } = require('child_process');

const app = express();


const isPkg = typeof process.pkg !== 'undefined';


const uploadDir = isPkg
    ? path.join(path.dirname(process.execPath), 'uploads')  
    : path.join(__dirname, 'uploads');  


if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}


const upload = multer({ dest: uploadDir });


const configFilePath = isPkg
    ? path.join(path.dirname(process.execPath), 'emailConfig.json')
    : path.join(__dirname, 'emailConfig.json');


function loadEmailConfig() {
    try {
        if (fs.existsSync(configFilePath)) {
            const data = fs.readFileSync(configFilePath, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error("Erro ao carregar configurações de e-mail:", error);
    }
    return {}; 
}

function saveEmailConfig(config) {
    try {
        fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2), 'utf8');
        console.log("Configuração de e-mail salva com sucesso.");
    } catch (error) {
        console.error("Erro ao salvar configuração de e-mail:", error);
    }
}

let emailConfig = loadEmailConfig();
let sendingStatus = false;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.get("/track-email/:id", (req, res) => {
    const emailId = req.params.id;
    console.log(`E-mail com ID ${emailId} foi aberto.`);
    
    
    res.sendFile(path.join(__dirname, 'public', 'img', 'invisible.png'));
});


app.post("/set-email-config", (req, res) => {
    const { email, password, smtpHost, smtpPort } = req.body;

    emailConfig = {
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort == 465, 
        auth: {
            user: email,
            pass: password,
        },
        tls: {
            rejectUnauthorized: false
        }
    };

    saveEmailConfig(emailConfig);

    res.status(200).send("Configuração de e-mail e SMTP definida com sucesso!");
});


async function sendEmails(transporter, mailOptionsList, interval, res) {
    sendingStatus = true;

    for (let i = 0; i < mailOptionsList.length; i++) {
        try {
            if (!mailOptionsList[i].to) {
                console.error("Nenhum destinatário definido para este e-mail:", mailOptionsList[i]);
                continue; 
            }

            await transporter.sendMail(mailOptionsList[i]);
            console.log(`E-mail enviado para: ${mailOptionsList[i].to}`);
        } catch (error) {
            console.error(`Erro ao enviar e-mail para ${mailOptionsList[i].to}: `, error);
        }

        // Pausa entre os envios
        if (i < mailOptionsList.length - 1) {
            await new Promise(resolve => setTimeout(resolve, interval));
        }
    }

    sendingStatus = false; 
    res.status(200).send("Todos os e-mails foram enviados com sucesso!");
}


app.post("/send-email", upload.fields([{ name: 'file' }, { name: 'image' }, { name: 'attachment1' }, { name: 'attachment2' }]), async (req, res) => {
    try {
        const { subject, interval = 5000 } = req.body; // O intervalo entre os envios será de 5 segundos por padrão

        if (!emailConfig.auth) {
            return res.status(400).send("Configuração de e-mail não definida.");
        }

    
        const message = req.body.message;

     
        const workbook = xlsx.readFile(req.files['file'][0].path);
        const sheet_name_list = workbook.SheetNames;
        const sheet = workbook.Sheets[sheet_name_list[0]];

        // Convertendo a primeira coluna (A) em uma lista de e-mails, sem cabeçalho
        const emails = xlsx.utils.sheet_to_json(sheet, { header: 1 }) // header: 1 significa que não estamos assumindo um cabeçalho
            .map(row => row[0]) // Pegando o primeiro valor de cada linha (Coluna A)
            .filter(email => typeof email === 'string' && email.includes('@')); // Filtrar valores válidos


        if (!emails || emails.length === 0) {
            console.error("Nenhum e-mail foi carregado a partir do arquivo Excel.");
            return res.status(400).send("Nenhum e-mail encontrado na lista.");
        }

        console.log("E-mails carregados:", emails);


        let imagePath;
        if (req.files['image']) {
            imagePath = path.join(uploadDir, req.files['image'][0].filename);
        }

 
        let attachments = [];
        if (req.files['attachment1']) {
            attachments.push({
                filename: req.files['attachment1'][0].originalname,
                path: path.join(uploadDir, req.files['attachment1'][0].filename)
            });
        }
        if (req.files['attachment2']) {
            attachments.push({
                filename: req.files['attachment2'][0].originalname,
                path: path.join(uploadDir, req.files['attachment2'][0].filename)
            });
        }

        const transporter = nodemailer.createTransport(emailConfig);

        const mailOptionsList = emails.map((email, index) => {
            if (!email) {
                console.error("E-mail não definido para um dos registros.");
                return null;
            }

   
            const trackingUrl = `http://localhost:3000/track-email/${index}`;

            return {
                from: emailConfig.auth.user,
                to: email,
                subject: subject,
                html: `<div>
                          <p>${message}</p>
                          ${imagePath ? `<img src="cid:unique@image" style="width: 300px; height: auto;" />` : ''}
                          <img src="${trackingUrl}" alt="" width="1" height="1" />
                       </div>`,
                attachments: imagePath
                    ? [{ filename: path.basename(imagePath), path: imagePath, cid: 'unique@image' }, ...attachments]
                    : attachments,

             
                headers: {
                    'Disposition-Notification-To': emailConfig.auth.user  // Seu e-mail para onde a confirmação será enviada
                }
            };
        }).filter(mailOptions => mailOptions !== null); // Filtrar e-mails válidos

        // Enviar e-mails com o temporizador entre cada envio
        sendEmails(transporter, mailOptionsList, parseInt(interval), res);

    } catch (error) {
        console.error("Erro ao processar o envio de e-mails:", error);
        res.status(500).send("Erro ao processar o envio de e-mails.");
    }
});

// Endpoint para verificar o status da lista de e-mails
app.get("/status", (req, res) => {
    if (sendingStatus) {
        res.status(200).send("Status: Envio de e-mails em andamento.");
    } else {
        res.status(200).send("Status: Todos os e-mails foram processados.");
    }
});

// Iniciar o servidor e abrir o navegador automaticamente
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    
    // Abre o navegador usando o comando "start" no Windows
    exec(`start http://localhost:${PORT}`);
});
