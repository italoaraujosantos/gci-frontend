function calcularInvestido(ativo) {

    return ativo.quantidade *
           ativo.precoCompra;
}


function calcularAtual(ativo) {

    return ativo.quantidade *
           (ativo.cotacaoAtual || ativo.precoCompra);
}


function calcularResultado(ativo) {

    return calcularAtual(ativo) -
           calcularInvestido(ativo);
}


function calcularTotais(ativos) {

    let totalInvestido = 0;
    let valorAtual = 0;

    ativos.forEach(ativo => {

        totalInvestido +=
            calcularInvestido(ativo);

        valorAtual +=
            calcularAtual(ativo);

    });

    return {

        totalInvestido,

        valorAtual,

        resultado:
            valorAtual - totalInvestido,

        quantidadeAtivos:
            ativos.length
    };
}

export {
    calcularInvestido,
    calcularAtual,
    calcularResultado,
    calcularTotais
};