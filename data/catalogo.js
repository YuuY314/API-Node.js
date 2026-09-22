const dadosDoCatalogo = [
    {
        id: 1,
        nome: "Teclado",
        preco: 120,
        estoque: 8,
        categoria: "Periféricos"
    },
    {
        id: 2,
        nome: "Monitor",
        preco: 950,
        estoque: 3,
        categoria: "Vídeos"
    },
    {
        id: 3,
        nome: "Mouse",
        preco: 80,
        estoque: 12,
        categoria: "Periféricos"
    }
];

export function listarDadosDoCatalogo(){
    return dadosDoCatalogo.map((produto)=>({...produto}))
}