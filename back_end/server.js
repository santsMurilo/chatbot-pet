const express = require("express");
const fs = require("fs");
const bcrypt = require("bcrypt");
const session = require("express-session");

const app = express();

app.use(express.json());

app.use(express.static(__dirname));

app.use(session({
    secret:"ringneck",
    resave:false,
    saveUninitialized:false
}));

/* USERS */

function lerUsuarios(){

    if(!fs.existsSync("users.json")){

        fs.writeFileSync(
            "users.json",
            "[]"
        );
    }

    return JSON.parse(
        fs.readFileSync("users.json")
    );
}

function salvarUsuarios(users){

    fs.writeFileSync(
        "users.json",
        JSON.stringify(users,null,2)
    );
}

/* REGISTER */

app.post("/register", async(req,res)=>{

    const {usuario,senha} = req.body;

    const users = lerUsuarios();

    const existe = users.find(
        u => u.usuario === usuario
    );

    if(existe){

        return res.json({
            erro:"Usuário já existe"
        });
    }

    const hash = await bcrypt.hash(senha,10);

    users.push({
        usuario,
        senha:hash
    });

    salvarUsuarios(users);

    req.session.user = usuario;

    res.json({
        sucesso:true
    });
});

/* LOGIN */

app.post("/login", async(req,res)=>{

    const {usuario,senha} = req.body;

    const users = lerUsuarios();

    const user = users.find(
        u => u.usuario === usuario
    );

    if(!user){

        return res.json({
            erro:"Usuário não encontrado"
        });
    }

    const ok = await bcrypt.compare(
        senha,
        user.senha
    );

    if(!ok){

        return res.json({
            erro:"Senha incorreta"
        });
    }

    req.session.user = usuario;

    res.json({
        sucesso:true
    });
});

/* ME */

app.get("/me",(req,res)=>{

    if(!req.session.user){

        return res.json({
            logado:false
        });
    }

    res.json({
        logado:true,
        usuario:req.session.user
    });
});

/* LOGOUT */

app.get("/logout",(req,res)=>{

    req.session.destroy();

    res.json({
        sucesso:true
    });
});

/* CHAT */

app.post("/chat",(req,res)=>{

    const {mensagem} = req.body;

    res.json({
        resposta:`🦜 Ring Neck respondeu: ${mensagem}`
    });
});

app.listen(3000,()=>{

    console.log("Servidor rodando");
});