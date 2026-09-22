const nomeObrigatorios = ["PORT", "NOME_ALUNO", "TURMA"];

export function carregarAmbiente(arquivoDeConfiguracao){
    if(arquivoDeConfiguracao){
        try {
            process.loadEnvFile(arquivoDeConfiguracao);
        } catch {
            throw new Error(`Arquivo não encontrado: ${arquivoDeConfiguracao}`);
        }
    }

    const ausentes = nomeObrigatorios.filter((nome) => {
        const valor = process.env[nome];
        return typeof valor !== "string" || valor.trim() === "";
    });

    if(ausentes.length > 0){
        throw new Error(`Configure no .env ${ausentes.join(", ")}`);
    }

    return {
        nomeAluno: process.env.NOME_ALUNO,
        turma: process.env.TURMA,
        porta: process.env.PORT,
        ambiente: process.env.NODE_ENV || "development"
    };
}

export function exibirDiagnostico(configuracao){
    console.table({
        estudantes: configuracao.nomeAluno,
        turma: configuracao.turma,
        projetos: "api-produtos",
        ambiente: configuracao.ambiente,
        node: process.version,
        sistema: `${process.platform} ${process.arch}`,
        diretorio: process.cwd(),
        portaConfigurada: configuracao.porta
    });
};