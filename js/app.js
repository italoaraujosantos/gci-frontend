import { api } from "./api.js";
import {
    calcularInvestido,
    calcularAtual,
    calcularResultado,
    calcularTotais
} from "./carteira.js";

let ativos = [];

const form = document.getElementById(
    "ativoForm"
);

const modal = document.getElementById(
    "modal"
);

const carteiraBody =
    document.getElementById(
        "carteiraBody"
    );


document.addEventListener(
    "DOMContentLoaded",
    carregarCarteira
);


async function carregarCarteira() {

    try {

        ativos =
            await api.listarAtivos();

        renderizarCarteira();

        atualizarDashboard();

    } catch (error) {

        mostrarNotificacao(
            error.message
        );

    }

}


function renderizarCarteira() {

    carteiraBody.innerHTML = "";

    if (ativos.length === 0) {

        carteiraBody.innerHTML = `
            <tr>
                <td colspan="8">
                    Nenhum ativo cadastrado.
                </td>
            </tr>
        `;

        return;
    }


    ativos.forEach(ativo => {

        const investido =
            calcularInvestido(ativo);

        const atual =
            calcularAtual(ativo);

        const resultado =
            calcularResultado(ativo);


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                <strong>
                    ${ativo.ticker}
                </strong>
            </td>

            <td>
                ${ativo.quantidade}
            </td>

            <td>
                ${formatarMoeda(
                    ativo.precoMedio
                )}
            </td>

            <td>
                ${formatarMoeda(
                    ativo.cotacaoAtual ||
                    ativo.precoMedio
                )}
            </td>

            <td>
                ${formatarMoeda(
                    investido
                )}
            </td>

            <td>
                ${formatarMoeda(
                    atual
                )}
            </td>

            <td>
                ${formatarMoeda(
                    resultado
                )}
            </td>

            <td>

                <div class="actions">

                    <button
                        class="btn btn-edit"
                        onclick="editarAtivo(${ativo.id})">

                        Editar

                    </button>

                    <button
                        class="btn btn-danger"
                        onclick="excluirAtivo(${ativo.id})">

                        Excluir

                    </button>

                </div>

            </td>
        `;


        carteiraBody.appendChild(row);

    });

}


function atualizarDashboard() {

    const totais =
        calcularTotais(ativos);


    document.getElementById(
        "totalInvestido"
    ).textContent =
        formatarMoeda(
            totais.totalInvestido
        );


    document.getElementById(
        "valorAtual"
    ).textContent =
        formatarMoeda(
            totais.valorAtual
        );


    document.getElementById(
        "resultado"
    ).textContent =
        formatarMoeda(
            totais.resultado
        );


    document.getElementById(
        "quantidadeAtivos"
    ).textContent =
        totais.quantidadeAtivos;

}


document.getElementById(
    "btnNovoAtivo"
).addEventListener(
    "click",
    abrirNovoAtivo
);


function abrirNovoAtivo() {

    form.reset();

    document.getElementById(
        "ativoId"
    ).value = "";

    document.getElementById(
        "modalTitle"
    ).textContent =
        "Novo ativo";

    modal.classList.remove(
        "hidden"
    );

}


async function editarAtivo(id) {

    try {

        const ativo =
            await api.buscarAtivo(id);


        document.getElementById(
            "ativoId"
        ).value = ativo.id;


        document.getElementById(
            "ticker"
        ).value =
            ativo.ticker;

        document.getElementById(
            "nome"
        ).value =
            ativo.nome;


        document.getElementById(
            "quantidade"
        ).value =
            ativo.quantidade;


        document.getElementById(
            "precoCompra"
        ).value =
            ativo.precoCompra;

        document.getElementById(
            "modalTitle"
        ).textContent =
            "Editar ativo";


        modal.classList.remove(
            "hidden"
        );

    } catch (error) {

        mostrarNotificacao(
            error.message
        );

    }

}


form.addEventListener(
    "submit",
    salvarAtivo
);


async function salvarAtivo(event) {

    event.preventDefault();


    const id =
        document.getElementById(
            "ativoId"
        ).value;


    const ativo = {

        ticker:
            document.getElementById(
                "ticker"
            ).value.toUpperCase(),

        nome:
            document.getElementById(
                "nome"
            ).value,

        quantidade:
            Number(
                document.getElementById(
                    "quantidade"
                ).value
            ),

        precoCompra:
            Number(
                document.getElementById(
                    "precoCompra"
                ).value
            )
    };


    try {

        if (id) {

            await api.atualizarAtivo(
                id,
                ativo
            );

            mostrarNotificacao(
                "Ativo atualizado com sucesso."
            );

        } else {

            await api.criarAtivo(
                ativo
            );

            mostrarNotificacao(
                "Ativo cadastrado com sucesso."
            );

        }


        fecharModal();

        await carregarCarteira();

    } catch (error) {

        mostrarNotificacao(
            error.message
        );

    }

}


async function excluirAtivo(id) {

    const confirmar =
        confirm(
            "Deseja realmente excluir este ativo?"
        );


    if (!confirmar) {
        return;
    }


    try {

        await api.excluirAtivo(id);

        mostrarNotificacao(
            "Ativo excluído com sucesso."
        );

        await carregarCarteira();

    } catch (error) {

        mostrarNotificacao(
            error.message
        );

    }

}


document.getElementById(
    "btnFecharModal"
).addEventListener(
    "click",
    fecharModal
);


document.getElementById(
    "btnCancelar"
).addEventListener(
    "click",
    fecharModal
);


function fecharModal() {

    modal.classList.add(
        "hidden"
    );

}


document.getElementById(
    "btnAtualizar"
).addEventListener(
    "click",
    atualizarCotacoes
);


async function atualizarCotacoes() {

    mostrarNotificacao(
        "Atualizando cotações..."
    );


    for (const ativo of ativos) {

        try {

            const data =
                await api.buscarCotacao(
                    ativo.ticker
                );


            if (
                data &&
                data.results &&
                data.results[ativo.ticker]
            ) {

                ativo.cotacaoAtual =
                    data.results[
                        ativo.ticker
                    ].price;

            }

        } catch (error) {

            console.error(
                `Erro ao consultar ${ativo.ticker}`,
                error
            );

        }

    }


    renderizarCarteira();

    atualizarDashboard();

    mostrarNotificacao(
        "Cotações atualizadas."
    );

}


function formatarMoeda(valor) {

    return new Intl.NumberFormat(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    ).format(valor || 0);

}


function mostrarNotificacao(
    mensagem
) {

    const notification =
        document.getElementById(
            "notification"
        );


    notification.textContent =
        mensagem;


    notification.classList.remove(
        "hidden"
    );


    setTimeout(() => {

        notification.classList.add(
            "hidden"
        );

    }, 3000);

}

export { api };