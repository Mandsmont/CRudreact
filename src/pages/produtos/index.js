import "./index.css";
import produtoService from "../../services/produto-service";
import Swal from "sweetalert2";
import Produto from "../../models/produto";
import { useState, useEffect } from "react";

export default function Produtos() {
    const [produtos, setProdutos] = useState([]);
    const [produto, setProduto] = useState(new Produto());
    const [modoEdicao, setModoEdicao] = useState(false);

    useEffect(() => {
        produtoService.obter().then((response) => {
            setProdutos(response.data);
        });
    }, []);

    const editar = (id) => {
        setModoEdicao(true);
        let produtoParaEditar = produtos.find(p => p.id === id);
    
        // Verifica se o produto foi encontrado antes de continuar
        if (produtoParaEditar) {
            if (produtoParaEditar.dataCadastro) {
                produtoParaEditar.dataCadastro = produtoParaEditar.dataCadastro.substring(0, 10);
            }
            setProduto(produtoParaEditar);
        } else {
            console.error('Produto não encontrado com o ID:', id);
        }
    }
    

    const excluirProdutoLista = (id) => {
        const novosProdutos = produtos.filter(produto => produto.id !== id);
        setProdutos(novosProdutos);
    }

    const excluir = (id) => {
        let produtoParaExcluir = produtos.find(p => p.id === id);

        if (produtoParaExcluir) {
            Swal.fire({
                title: 'Deseja realmente excluir o produto?',
                text: produtoParaExcluir.nome,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sim, excluir!',
                cancelButtonText: 'Cancelar',
            }).then((result) => {
                if (result.isConfirmed) {
                    produtoService.excluir(id)
                        .then(() => {
                            excluirProdutoLista(id);
                        });
                }
            });
        }
    }

    const salvar = () => {
        if (!produto.nome || !produto.quantidadeEstoque) {
            Swal.fire({
                icon: 'error',
                text: 'Nome e Quantidade de Estoque são obrigatórios'
            });

            return; // Retorna para evitar a execução do código abaixo caso haja erro de validação
        }

        const atualizarProdutoNoBackend = (produto) => {
            produtoService.atualizar(produto)
                .then(response => {
                    limparModal();
        
                    Swal.fire({
                        icon: "success",
                        position: "top-end",
                        title: `${produto.nome}, foi atualizado com sucesso`,
                        timer: 5000
                    });
                    let indice = produtos.findIndex(p => p.id === produto.id);
                    const novaListaProdutos = [...produtos];
                    novaListaProdutos.splice(indice, 1, produto);
                    setProdutos(novaListaProdutos);
        
                    // Fechar o modal após a atualização
                    document.getElementById('modal-produto').classList.remove('show');
                    document.getElementById('modal-produto').style.display = 'none';
                    document.getElementsByClassName('modal-backdrop')[0].remove();
                })
        }
        
        // Chama a função adequada com base no modo de edição
        (modoEdicao) ? atualizarProdutoNoBackend(produto) : adicionarProdutoNoBackEnd(produto);
    }

    const adicionar = () => {
        setModoEdicao(false);
        limparModal();
    }

    const limparModal = () => {
          // Limpa os dados do produto para adicionar outro produto
          setProduto({
            id: '',
            nome: '',
            valor: '',
            quantidadeEstoque: '',
            dataCadastro: '',
            observacao: ''
        });

    }

    const adicionarProdutoNoBackEnd = (produto) => {
        produtoService.adicionar(produto)
            .then(response => {
                setProdutos([...produtos, response.data]); // Adiciona o novo produto à lista
                limparModal(); 
    
                Swal.fire({
                    icon: "success",
                    position: "top-end",
                    title: `${response.data.nome}, adicionado com sucesso`,
                    timer: 5000
                });
            })
            .catch(error => {
                console.error('Erro ao adicionar produto:', error);
            });
    }
    

    return (
        <div className="container">
            {/* <!-- Titulo --> */}
            <div className="row">
                <div className="col-sm-12">
                    <h4>Produtos</h4>
                    <hr />
                </div>
            </div>
    
            {/* <!-- Botão para adicionar --> */}
            <div className="row">
                <div className="col-sm-3">
                    <button onClick={adicionar} id="btn-adicionar" className="btn btn-primary btn-sm" title="Adicionar novo produto" data-bs-toggle="modal" data-bs-target="#modal-produto">Adicionar</button>
                </div>
            </div>
    
            {/* <!-- Tabela --> */}
            <div className="row mt-3">
                <div className="col-sm-12">
                    <table className="table table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Nome</th>
                                <th>Valor (R$)</th>
                                <th>Quantidade de Estoque (un)</th>
                                <th>Observação</th>
                                <th>Data de cadastro</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {produtos.map(produto => (
                                <tr key={produto.id}>
                                    <td>{produto.id}</td>
                                    <td>{produto.nome}</td>
                                    <td>{produto.valor}</td>
                                    <td>{produto.quantidadeEstoque}</td>
                                    <td>{produto.observacao}</td>
                                    <td>{new Date(produto.dataCadastro).toLocaleDateString()}</td>
                                    <td>
                                        <button onClick={() => editar(produto.id)} className="btn btn-outline-primary btn-sm mr-3" data-bs-toggle="modal" data-bs-target="#modal-produto">
                                            Editar
                                        </button>
                                        <button onClick={() => excluir(produto.id)} className="btn btn-outline-primary btn-sm mr-3">
                                            Excluir
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
    
            {/* <!-- The Modal --> */}
            <div className={"modal " + (modoEdicao ? "show" : "")} id="modal-produto">
                <div className="modal-dialog">
                    <div className="modal-content">
    
                        {/* <!-- Modal Header --> */}
                        <div className="modal-header">
                            <h4 className="modal-title">{modoEdicao ? 'Editar Produto' : 'Adicionar Produto'}</h4>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
    
                        {/* <!-- Modal body --> */}
                        <div className="modal-body">
    
                            <div className="row">
    
                                <div className="col-sm-2">
                                    <label htmlFor="id" className="form-label">Id</label>
                                    <input id="id" type="text" disabled className="form-control"
                                        value={produto.id}
                                        onChange={(e) => setProduto({ ...produto, id: e.target.value })} />
                                </div>
    
                                <div className="col-sm-10">
                                    <label htmlFor="nome" className="form-label">Nome</label>
                                    <input id="nome" type="text" className="form-control"
                                        value={produto.nome}
                                        onChange={(e) => setProduto({ ...produto, nome: e.target.value })} />
                                </div>
                            </div>
    
                            <div className="row">
    
                                <div className="col-sm-10">
                                    <label htmlFor="valor" className="form-label">Valor (R$)</label>
                                    <input id="valor" type="number" className="form-control"
                                        value={produto.valor}
                                        onChange={(e) => setProduto({ ...produto, valor: e.target.value })} />
                                </div>
    
                                <div className="col-sm-10">
                                    <label htmlFor="quantidadeEstoque" className="form-label">Quantidade de Estoque (un)</label>
                                    <input id="quantidadeEstoque" type="number" className="form-control"
                                        value={produto.quantidadeEstoque}
                                        onChange={(e) => setProduto({ ...produto, quantidadeEstoque: e.target.value })} />
                                </div>
    
                                <div className="col-sm-3">
                                    <label htmlFor="observacao" className="form-label">Observação</label>
                                    <input id="observacao" type="text" className="form-control" maxLength="14"
                                        value={produto.observacao}
                                        onChange={(e) => setProduto({ ...produto, observacao: e.target.value })} />
                                </div>
    
                                <div className="col-sm-3">
                                    <label htmlFor="dataCadastro" className="form-label">Data de Cadastro</label>
                                    <input id="dataCadastro" type="date" className="form-control"
                                        value={produto.dataCadastro}
                                        onChange={(e) => setProduto({ ...produto, dataCadastro: e.target.value })} />
                                </div>
    
                            </div>
                        </div>
    
                        {/* <!-- Modal footer --> */}
                        <div className="modal-footer">
                            <button id="btn-salvar" type="button" className="btn btn-primary btn-sm" onClick={salvar}>Salvar</button>
                            <button id="btn-cancelar" type="button" className="btn btn-light btn-sm" data-bs-dismiss="modal">Cancelar</button>
                        </div>
    
                    </div>
                </div>
            </div>
        </div>
    );
                            }    