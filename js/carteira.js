function calcularInvestido(ativo) {
    return Number(ativo.quantidade || 0) * Number(ativo.precoCompra || 0);
}

function calcularAtual(ativo) {
    const preco = ativo.precoAtual ?? ativo.precoCompra ?? 0;
    return Number(ativo.quantidade || 0) * Number(preco);
}

function calcularResultado(ativo) {
    return calcularAtual(ativo) - calcularInvestido(ativo);
}

function calcularTotais(ativos) {
    const totalInvestido = ativos.reduce(
        (total, ativo) => total + calcularInvestido(ativo), 0
    );

    const valorAtual = ativos.reduce(
        (total, ativo) => total + calcularAtual(ativo), 0
    );

    return {
        totalInvestido,
        valorAtual,
        resultado: valorAtual - totalInvestido,
        quantidadeAtivos: ativos.length
    };
}

export {
    calcularInvestido,
    calcularAtual,
    calcularResultado,
    calcularTotais
};
