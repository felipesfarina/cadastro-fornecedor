const express = require('express');
const path = require('path');

const app = express();
const porta = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Lista para armazenar fornecedores cadastrados
let fornecedores = [];
let usuarioLogado = null;

// Rota principal - Home
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

// exibe formularios
app.get('/cadastrar-fornecedor', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'cadastro-fornecedor.html'));
});

// Rota para processar cadastro de fornecedor (POST)
app.post('/cadastrar-fornecedor', (req, res) => {
    const { cnpj, razaoSocial, nomeFantasia, endereco, cidade, uf, cep, email, telefone } = req.body;
    
    let erros = [];
    
    // Validação - todos os campos são obrigatórios
    if (!cnpj || cnpj.trim() === '') {
        erros.push('CNPJ não foi preenchido');
    }
    if (!razaoSocial || razaoSocial.trim() === '') {
        erros.push('Razão Social não foi preenchida');
    }
    if (!nomeFantasia || nomeFantasia.trim() === '') {
        erros.push('Nome Fantasia não foi preenchido');
    }
    if (!endereco || endereco.trim() === '') {
        erros.push('Endereço não foi preenchido');
    }
    if (!cidade || cidade.trim() === '') {
        erros.push('Cidade não foi preenchida');
    }
    if (!uf || uf.trim() === '') {
        erros.push('UF não foi preenchida');
    }
    if (!cep || cep.trim() === '') {
        erros.push('CEP não foi preenchido');
    }
    if (!email || email.trim() === '') {
        erros.push('Email não foi preenchido');
    }
    if (!telefone || telefone.trim() === '') {
        erros.push('Telefone não foi preenchido');
    }
    
    // Se houver erros, retorna página com mensagens de erro
    if (erros.length > 0) {
        let htmlErros = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Erro no Cadastro</title>
            <link rel="stylesheet" href="/css/style.css">
        </head>
        <body>
            <nav class="menu">
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/cadastrar-fornecedor">Cadastrar Fornecedor</a></li>
                    <li><a href="/login">Login</a></li>
                    <li><a href="/logout">Logout</a></li>
                </ul>
            </nav>
            <div class="container">
                <h1>Erro no Cadastro de Fornecedor</h1>
                <div class="erro">
                    <h2>Os seguintes erros foram encontrados:</h2>
                    <ul>`;
        
        erros.forEach(erro => {
            htmlErros += `<li>${erro}</li>`;
        });
        
        htmlErros += `
                    </ul>
                </div>
                <a href="/cadastrar-fornecedor" class="btn">Voltar ao Formulário</a>
            </div>
        </body>
        </html>`;
        
        return res.send(htmlErros);
    }
    
    // Se não houver erros, cadastra o fornecedor
    const fornecedor = {
        id: fornecedores.length + 1,
        cnpj,
        razaoSocial,
        nomeFantasia,
        endereco,
        cidade,
        uf,
        cep,
        email,
        telefone,
        dataCadastro: new Date().toLocaleString('pt-BR')
    };
    
    fornecedores.push(fornecedor);
    
    // Retorna página de sucesso com lista de fornecedores
    let html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Fornecedor Cadastrado</title>
        <link rel="stylesheet" href="/css/style.css">
    </head>
    <body>
        <nav class="menu">
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/cadastrar-fornecedor">Cadastrar Fornecedor</a></li>
                <li><a href="/login">Login</a></li>
                <li><a href="/logout">Logout</a></li>
            </ul>
        </nav>
        <div class="container">
            <h1>Fornecedor Cadastrado com Sucesso!</h1>
            <div class="sucesso">
                <p><strong>CNPJ:</strong> ${cnpj}</p>
                <p><strong>Razão Social:</strong> ${razaoSocial}</p>
                <p><strong>Nome Fantasia:</strong> ${nomeFantasia}</p>
                <p><strong>Endereço:</strong> ${endereco}</p>
                <p><strong>Cidade:</strong> ${cidade}</p>
                <p><strong>UF:</strong> ${uf}</p>
                <p><strong>CEP:</strong> ${cep}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Telefone:</strong> ${telefone}</p>
                <p><strong>Data de Cadastro:</strong> ${fornecedor.dataCadastro}</p>
            </div>
            
            <h2>Fornecedores Cadastrados (${fornecedores.length})</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>CNPJ</th>
                        <th>Razão Social</th>
                        <th>Nome Fantasia</th>
                        <th>Cidade</th>
                        <th>UF</th>
                        <th>Telefone</th>
                    </tr>
                </thead>
                <tbody>`;
    
    fornecedores.forEach(f => {
        html += `
                    <tr>
                        <td>${f.id}</td>
                        <td>${f.cnpj}</td>
                        <td>${f.razaoSocial}</td>
                        <td>${f.nomeFantasia}</td>
                        <td>${f.cidade}</td>
                        <td>${f.uf}</td>
                        <td>${f.telefone}</td>
                    </tr>`;
    });
    
    html += `
                </tbody>
            </table>
            <a href="/cadastrar-fornecedor" class="btn">Cadastrar Novo Fornecedor</a>
        </div>
    </body>
    </html>`;
    
    res.send(html);
});

// Rota para exibir página de login
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Rota para processar login (POST) - sem validação por enquanto
app.post('/login', (req, res) => {
    const { usuario, senha } = req.body;
    
    // Sem validação real, apenas armazena o usuário
    usuarioLogado = usuario;
    
    let html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login Realizado</title>
        <link rel="stylesheet" href="/css/style.css">
    </head>
    <body>
        <nav class="menu">
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/cadastrar-fornecedor">Cadastrar Fornecedor</a></li>
                <li><a href="/login">Login</a></li>
                <li><a href="/logout">Logout</a></li>
            </ul>
        </nav>
        <div class="container">
            <h1>Login Realizado com Sucesso!</h1>
            <div class="sucesso">
                <p>Bem-vindo(a), <strong>${usuario}</strong>!</p>
                <p>Você está logado no sistema.</p>
            </div>
            <a href="/" class="btn">Voltar para Home</a>
        </div>
    </body>
    </html>`;
    
    res.send(html);
});

// Rota para logout
app.get('/logout', (req, res) => {
    usuarioLogado = null;
    
    let html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Logout</title>
        <link rel="stylesheet" href="/css/style.css">
    </head>
    <body>
        <nav class="menu">
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/cadastrar-fornecedor">Cadastrar Fornecedor</a></li>
                <li><a href="/login">Login</a></li>
                <li><a href="/logout">Logout</a></li>
            </ul>
        </nav>
        <div class="container">
            <h1>Logout Efetuado com Sucesso!</h1>
            <div class="sucesso">
                <p>Você saiu do sistema.</p>
            </div>
            <a href="/" class="btn">Voltar para Home</a>
        </div>
    </body>
    </html>`;
    
    res.send(html);
});

app.listen(porta, () => {
    console.log(`Servidor rodando em http://localhost:${porta}`);
});

module.exports = app;
