document.addEventListener('DOMContentLoaded', () => {
    const usuarioForm = document.getElementById('usuarioForm');
    const mensagemDiv = document.getElementById('mensagem');
    const listaUsuarios = document.getElementById('listaUsuarios');
    
    let isEditMode = false;
    let editingId = null;
    
    // Carregar usuários ao iniciar a página
    carregarUsuarios();
    
    // Evento de submissão do formulário
    usuarioForm.addEventListener('submit', handleSubmit);
    
    async function handleSubmit(e) {
        e.preventDefault();
        
        const usuario = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            idade: parseInt(document.getElementById('idade').value)
        };
        
        try {
            let response;
            
            if (isEditMode) {
                // Atualizar usuário existente
                response = await fetch(`/api/usuarios/${editingId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(usuario)
                });
            } else {
                // Criar novo usuário
                response = await fetch('/api/usuarios', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(usuario)
                });
            }
            
            const data = await response.json();
            
            if (response.ok) {
                mostrarMensagem(
                    isEditMode ? 'Usuário atualizado com sucesso!' : 'Usuário cadastrado com sucesso!',
                    'success'
                );
                resetarFormulario();
                carregarUsuarios();
            } else {
                mostrarMensagem(`Erro: ${data.erro}`, 'error');
            }
        } catch (erro) {
            mostrarMensagem('Erro ao conectar com o servidor', 'error');
            console.error('Erro:', erro);
        }
    }
    
    // Função para resetar o formulário
    function resetarFormulario() {
        usuarioForm.reset();
        isEditMode = false;
        editingId = null;
        const submitBtn = usuarioForm.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Cadastrar';
    }
    
    // Função para carregar a lista de usuários
    async function carregarUsuarios() {
        try {
            const response = await fetch('/api/usuarios');
            const usuarios = await response.json();
            
            listaUsuarios.innerHTML = '';
            
            usuarios.forEach(usuario => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <strong>${usuario.nome}</strong> (${usuario.email}) - ${usuario.idade} anos
                    <button class="btn-editar" data-id="${usuario._id}">Editar</button>
                    <button class="btn-excluir" data-id="${usuario._id}">Excluir</button>
                `;
                listaUsuarios.appendChild(li);
            });
            
            // Adicionar eventos aos botões de editar e excluir
            adicionarEventosBotoes();
            
        } catch (erro) {
            mostrarMensagem('Erro ao carregar usuários', 'error');
            console.error('Erro:', erro);
        }
    }
    
    // Função para adicionar eventos aos botões
    function adicionarEventosBotoes() {
        // Evento para botões de exclusão
        document.querySelectorAll('.btn-excluir').forEach(button => {
            button.addEventListener('click', async () => {
                const id = button.dataset.id;
                
                if (confirm('Tem certeza que deseja excluir este usuário?')) {
                    try {
                        const response = await fetch(`/api/usuarios/${id}`, {
                            method: 'DELETE'
                        });
                        
                        if (response.ok) {
                            mostrarMensagem('Usuário excluído com sucesso!', 'success');
                            carregarUsuarios();
                        } else {
                            const data = await response.json();
                            mostrarMensagem(`Erro: ${data.erro}`, 'error');
                        }
                    } catch (erro) {
                        mostrarMensagem('Erro ao conectar com o servidor', 'error');
                    }
                }
            });
        });
        
        // Evento para botões de edição
        document.querySelectorAll('.btn-editar').forEach(button => {
            button.addEventListener('click', async () => {
                const id = button.dataset.id;
                
                try {
                    const response = await fetch(`/api/usuarios/${id}`);
                    const usuario = await response.json();
                    
                    // Preencher formulário com dados do usuário
                    document.getElementById('nome').value = usuario.nome;
                    document.getElementById('email').value = usuario.email;
                    document.getElementById('idade').value = usuario.idade;
                    
                    // Alterar para modo de edição
                    isEditMode = true;
                    editingId = id;
                    
                    const submitBtn = usuarioForm.querySelector('button[type="submit"]');
                    submitBtn.textContent = 'Atualizar';
                    
                    // Scroll para o formulário
                    usuarioForm.scrollIntoView({ behavior: 'smooth' });
                } catch (erro) {
                    mostrarMensagem('Erro ao carregar dados do usuário', 'error');
                    console.error('Erro:', erro);
                }
            });
        });
    }
    
    // Função para mostrar mensagens
    function mostrarMensagem(texto, tipo) {
        mensagemDiv.textContent = texto;
        mensagemDiv.className = tipo;
        setTimeout(() => {
            mensagemDiv.textContent = '';
            mensagemDiv.className = '';
        }, 3000);
    }
});