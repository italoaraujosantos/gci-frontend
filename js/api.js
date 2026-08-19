const API_BASE_URL = import.meta.env.VITE_API_URL; 
const hg_chave = import.meta.env.VITE_BRASIL_KEY;


const api = {

    async listarAtivos() {

        const response = await fetch(
            `${API_BASE_URL}/ativos`
        );

        if (!response.ok) {
            throw new Error(
                "Erro ao buscar ativos."
            );
        }

        return await response.json();
    },


    async buscarAtivo(id) {

        const response = await fetch(
            `${API_BASE_URL}/ativos/${id}`
        );

        if (!response.ok) {
            throw new Error(
                "Ativo não encontrado."
            );
        }

        return await response.json();
    },


    async criarAtivo(ativo) {

        const response = await fetch(
            `${API_BASE_URL}/ativos`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(ativo)
            }
        );

        if (!response.ok) {
            throw new Error(
                "Erro ao cadastrar ativo."
            );
        }

        return await response.json();
    },


    async atualizarAtivo(id, ativo) {

        const response = await fetch(
            `${API_BASE_URL}/ativos/${id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(ativo)
            }
        );

        if (!response.ok) {
            throw new Error(
                "Erro ao atualizar ativo."
            );
        }

        return await response.json();
    },


    async excluirAtivo(id) {

        const response = await fetch(
            `${API_BASE_URL}/ativos/${id}`,
            {
                method: "DELETE"
            }
        );

        if (!response.ok) {
            throw new Error(
                "Erro ao excluir ativo."
            );
        }
    },


    async buscarCotacao(ticker) {

        const url = new URL(
            "/v2/finance/quotes",
            "https://api.hgbrasil.com"
        );

        url.searchParams.set(
            "tickers",
            `B3:${ticker}`
        );

        url.searchParams.set(
            "key",
            hg_chave
        );

        const response =
            await fetch(url.href);

        if (!response.ok) {
            throw new Error(
                "Erro ao consultar cotação."
            );
        }

        const data =
            await response.json();

        return data;
    }

};

export { api };