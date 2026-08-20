const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const api = {
    async listarAtivos() {
        const response = await fetch(`${API_BASE_URL}/ativos`);
        if (!response.ok) throw new Error("Erro ao buscar ativos.");
        return response.json();
    },

    async buscarAtivo(id) {
        const response = await fetch(`${API_BASE_URL}/ativos/${id}`);
        if (!response.ok) throw new Error("Ativo não encontrado.");
        return response.json();
    },

    async criarAtivo(ativo) {
        const response = await fetch(`${API_BASE_URL}/ativos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(ativo)
        });
        if (!response.ok) {
            const mensagem = await response.text();
            throw new Error(mensagem || "Erro ao cadastrar ativo.");
        }
        return response.json();
    },

    async atualizarAtivo(id, ativo) {
        const response = await fetch(`${API_BASE_URL}/ativos/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(ativo)
        });
        if (!response.ok) {
            const mensagem = await response.text();
            throw new Error(mensagem || "Erro ao atualizar ativo.");
        }
        return response.json();
    },

    async excluirAtivo(id) {
        const response = await fetch(`${API_BASE_URL}/ativos/${id}`, {
            method: "DELETE"
        });
        if (!response.ok) throw new Error("Erro ao excluir ativo.");
    },

    async atualizarCotacao(ticker) {
        const response = await fetch(
            `${API_BASE_URL}/ativos/${encodeURIComponent(ticker)}/cotacao`,
            { method: "PUT" }
        );

        if (!response.ok) {
            const mensagem = await response.text();
            throw new Error(mensagem || `Não foi possível obter a cotação de ${ticker}.`);
        }

        return response.json();
    }
};

export { api };
