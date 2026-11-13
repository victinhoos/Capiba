// ==========================================
// CARREGAR USUÁRIO
// ==========================================

async function carregarUsuario() {

    const elementoNome = document.getElementById("nome-usuario");

    try {

        // Primeiro tenta recuperar do LocalStorage
        let nome = localStorage.getItem("nomeUsuario");

        // Se não encontrar, consulta o Python
        if (!nome) {

            const usuario = await pywebview.api.obter_usuario();

            if (usuario) {
                nome = usuario.nome;

                // Atualiza o LocalStorage
                localStorage.setItem("nomeUsuario", nome);
            }
        }

        // Atualiza o nome na interface
        if (nome) {
            elementoNome.textContent = nome;
        }

    } catch (erro) {

        console.error("Erro ao carregar usuário:", erro);

    }

}


// ==========================================
// INICIALIZAÇÃO
// ==========================================

window.addEventListener("pywebviewready", carregarUsuario);