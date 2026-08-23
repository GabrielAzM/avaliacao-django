const chaveArmazenamento = 'perfil_token';

const secaoLogin = document.getElementById('secaoLogin');
const secaoCadastro = document.getElementById('secaoCadastro');
const secaoPerfil = document.getElementById('secaoPerfil');
const secaoLista = document.getElementById('secaoLista');
const botaoSair = document.getElementById('botaoSair');
const corpoTabela = document.getElementById('corpoTabela');
const nomeMarca = document.getElementById('nomeMarca');

function mostrarMensagem(tipo, texto) {
    const mensagemExistente = document.querySelector('.mensagem-sucesso, .mensagem-erro');
    if (mensagemExistente) mensagemExistente.remove();

    const div = document.createElement('div');
    div.className = tipo === 'erro' ? 'mensagem-erro' : 'mensagem-sucesso';
    div.textContent = texto;

    const formulario = document.querySelector('form');
    if (formulario) formulario.insertAdjacentElement('afterend', div);
}

function ajustarEstadoAutenticacao(logado, perfil = null) {
    secaoLogin.classList.toggle('oculto', logado);
    secaoCadastro.classList.toggle('oculto', true);
    secaoPerfil.classList.toggle('oculto', !logado);
    secaoLista.classList.toggle('oculto', !logado);
    botaoSair.classList.toggle('oculto', !logado);

    if (logado && perfil) {
        document.getElementById('campoNome').textContent = `Nome: ${perfil.nome}`;
        document.getElementById('campoEmpresa').textContent = `Empresa: ${perfil.empresa || 'Não informado'}`;
        document.getElementById('campoTelefone').textContent = `Telefone: ${perfil.telefone || 'Não informado'}`;
        document.getElementById('campoEmail').textContent = `E-mail: ${perfil.email}`;
        nomeMarca.textContent = perfil.nome;
    } else {
        nomeMarca.textContent = 'Experienceln';
    }
}

async function buscarJson(url, opcoes = {}) {
    const resposta = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            ...(opcoes.headers || {})
        },
        ...opcoes,
    });

    const tipoConteudo = resposta.headers.get('content-type') || '';
    const dados = tipoConteudo.includes('application/json') ? await resposta.json() : {};

    if (!resposta.ok) {
        throw new Error(dados.detail || dados.error || Object.values(dados)[0] || 'Erro ao processar a requisição.');
    }

    return dados;
}

async function carregarPerfilAtual() {
    const token = localStorage.getItem(chaveArmazenamento);
    if (!token) {
        ajustarEstadoAutenticacao(false);
        return;
    }

    try {
        const perfil = await buscarJson('/api/perfil/', {
            headers: {
                Authorization: `Token ${token}`
            }
        });
        ajustarEstadoAutenticacao(true, perfil);
        carregarPerfis();
    } catch (erro) {
        localStorage.removeItem(chaveArmazenamento);
        ajustarEstadoAutenticacao(false);
    }
}

async function carregarPerfis() {
    const token = localStorage.getItem(chaveArmazenamento);
    if (!token) return;

    try {
        const perfis = await buscarJson('/api/perfis/', {
            headers: {
                Authorization: `Token ${token}`
            }
        });
        corpoTabela.innerHTML = perfis.map((perfil) => `
            <tr>
                <td>${perfil.nome}</td>
                <td>${perfil.empresa || '—'}</td>
                <td>${perfil.email}</td>
            </tr>
        `).join('');
    } catch (erro) {
        console.error(erro);
    }
}

document.getElementById('formLogin').addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const email = document.getElementById('emailLogin').value.trim();
    const senha = document.getElementById('senhaLogin').value.trim();

    try {
        const dados = await buscarJson('/api/login/', {
            method: 'POST',
            body: JSON.stringify({ email, senha })
        });

        localStorage.setItem(chaveArmazenamento, dados.token);
        mostrarMensagem('sucesso', 'Login realizado com sucesso!');
        await carregarPerfilAtual();
    } catch (erro) {
        mostrarMensagem('erro', erro.message);
    }
});

document.getElementById('formCadastro').addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const dadosFormulario = {
        nome: document.getElementById('nomeCadastro').value.trim(),
        empresa: document.getElementById('empresaCadastro').value.trim(),
        telefone: document.getElementById('telefoneCadastro').value.trim(),
        email: document.getElementById('emailCadastro').value.trim(),
        senha: document.getElementById('senhaCadastro').value.trim(),
    };

    try {
        const dados = await buscarJson('/api/perfis/criar/', {
            method: 'POST',
            body: JSON.stringify(dadosFormulario)
        });

        mostrarMensagem('sucesso', 'Cadastro realizado com sucesso!');
        document.getElementById('formCadastro').reset();
        secaoCadastro.classList.add('oculto');
        secaoLogin.classList.remove('oculto');

        if (dados.token) {
            localStorage.setItem(chaveArmazenamento, dados.token);
            await carregarPerfilAtual();
        }
    } catch (erro) {
        mostrarMensagem('erro', erro.message);
    }
});

document.getElementById('alternarCadastro').addEventListener('click', (evento) => {
    evento.preventDefault();
    secaoLogin.classList.add('oculto');
    secaoCadastro.classList.remove('oculto');
});

document.getElementById('alternarLogin').addEventListener('click', (evento) => {
    evento.preventDefault();
    secaoCadastro.classList.add('oculto');
    secaoLogin.classList.remove('oculto');
});

botaoSair.addEventListener('click', async () => {
    const token = localStorage.getItem(chaveArmazenamento);
    if (token) {
        await fetch('/api/logout/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${token}`
            }
        });
    }

    localStorage.removeItem(chaveArmazenamento);
    ajustarEstadoAutenticacao(false);
});

carregarPerfilAtual();
