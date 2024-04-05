import "./index.css";
import clienteService from "../../services/cliente-service";
import Swal from "sweetalert2";
import ClienteModel from "../../models/cliente";

// HOOKS
import { useState, useEffect } from "react";

export default function Clientes() {
    const [clientes, setClientes] = useState([]);
    const [cliente, setCliente] = useState(new ClienteModel());
    const [modoEdicao, setModoEdicao] = useState(false);

    useEffect(() => {
        clienteService.obter().then((response) => {
            setClientes(response.data);
        });
    }, []);

    const editar = (id) => {
        setModoEdicao(true);
        let clienteParaEditar = clientes.find(c => c.id === id);
    
        // Verifica se o cliente foi encontrado antes de continuar
        if (clienteParaEditar) {
            if (clienteParaEditar.dataCadastro) {
                clienteParaEditar.dataCadastro = clienteParaEditar.dataCadastro.substring(0, 10);
            }
            setCliente(clienteParaEditar);
        } else {
            console.error('Cliente não encontrado com o ID:', id);
        }
    }
    

    const excluirClienteLista = (id) => {
        const novosClientes = clientes.filter(cliente => cliente.id !== id);
        setClientes(novosClientes);
    }

    const excluir = (id) => {
        let clienteParaExcluir = clientes.find(c => c.id === id);

        if (clienteParaExcluir) {
            Swal.fire({
                title: 'Deseja realmente excluir o cliente?',
                text: clienteParaExcluir.nome,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sim, excluir!',
                cancelButtonText: 'Cancelar',
            }).then((result) => {
                if (result.isConfirmed) {
                    clienteService.excluir(id)
                        .then(() => {
                            excluirClienteLista(id);
                        });
                }
            });
        }
    }

    const salvar = () => {
        if (!cliente.email || !cliente.cpfOuCnpj) {
            Swal.fire({
                icon: 'error',
                text: 'Email e CPF são obrigatórios'
            });

            return; // Retorna para evitar a execução do código abaixo caso haja erro de validação
        }

        const atualizarClienteNoBackend = (cliente) => {
            clienteService.atualizar(cliente)
                .then(response => {
                    limparModal();
        
                    Swal.fire({
                        icon: "success",
                        position: "top-end",
                        title: `${cliente.nome}, foi atualizado com sucesso`,
                        timer: 5000
                    });
                    let indice = clientes.findIndex(c => c.id == cliente.id);
                    const novaListaClientes = [...clientes];
                    novaListaClientes.splice(indice, 1, cliente);
                    setClientes(novaListaClientes);
        
                    // Fechar o modal após a atualização
                    document.getElementById('modal-cliente').classList.remove('show');
                    document.getElementById('modal-cliente').style.display = 'none';
                    document.getElementsByClassName('modal-backdrop')[0].remove();
                })
        }
        
        // Chama a função adequada com base no modo de edição
        (modoEdicao) ? atualizarClienteNoBackend(cliente) : adicionarClienteNoBackEnd(cliente);
    }

    const adicionar = () => {
        setModoEdicao(false);
        limparModal();
    }

    const limparModal = () => {
          // Limpa os dados do cliente para adicionar outro cliente
          setCliente({
            id: '',
            nome: '',
            cpfOuCnpj: '',
            telefone: '',
            dataCadastro: '',
            email: ''
        });

    }

    const adicionarClienteNoBackEnd = (cliente) => {
        clienteService.adicionar(cliente)
            .then(response => {
                setClientes([...clientes, new ClienteModel(response.data)]); // Adiciona o novo cliente à lista
                limparModal(); 

                  // Limpa os dados do cliente para adicionar outro cliente
                  setCliente({
                    id: '',
                    nome: '',
                    cpfOuCnpj: '',
                    telefone: '',
                    dataCadastro: '',
                    email: ''
                });

                Swal.fire({
                    icon: "success",
                    position: "top-end",
                    title: `${cliente.nome}, adicionado com sucesso`,
                    timer: 5000
                });
            })
            .catch(error => {
                console.error('Erro ao adicionar cliente:', error);
            });
    }

    return (
        <div className="container">
            {/* Titulo */}
            <div className="row">
                <div className="col-sm-12">
                    <h4>Clientes</h4>
                    <hr />
                </div>
            </div>

            {/* Botão para adicionar */}
            <div className="row">
                <div className="col-sm-3">
                    <button onClick={adicionar}
                        id="btn-adicionar"
                        className="btn btn-primary btn-sm "
                        data-bs-toggle="modal"
                        data-bs-target="#modal-cliente"
                    >
                        Adicionar
                    </button>
                </div>
            </div>

            {/* Tabela */}
            <div className="row mt-3">
                <div className="col-sm-12">
                    <table className="table table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Nome</th>
                                <th>CPF</th>
                                <th>E-mail</th>
                                <th>Telefone</th>
                                <th>Data de cadastro</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientes.map(cliente => (
                                <tr key={cliente.id}>
                                    <td>{cliente.id}</td>
                                    <td>{cliente.nome}</td>
                                    <td>{cliente.cpfOuCnpj}</td>
                                    <td>{cliente.email}</td>
                                    <td>{cliente.telefone}</td>
                                    <td>{new Date(cliente.dataCadastro).toLocaleDateString()}</td>
                                    <td>
                                        <button onClick={() => editar(cliente.id)} className="btn btn-outline-primary btn-sm mr-3" data-bs-toggle="modal" data-bs-target="#modal-cliente">Editar</button>
                                        <button onClick={() => excluir(cliente.id)} className="btn btn-outline-primary btn-sm mr-3">Excluir</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <div className="modal" id="modal-cliente">
                <div className="modal-dialog">
                    <div className="modal-content">
                        {/* Modal Header */}
                        <div className="modal-header">
                            <h4 className="modal-title">{modoEdicao ? 'Editar Cliente' : 'Adicionar Cliente'}</h4>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>

                        </div>

                        {/* Modal body */}
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-sm-2">
                                    <label htmlFor="id" className="form-label">
                                        Id
                                    </label>
                                    <input
                                        id="id"
                                        type="text"
                                        disabled
                                        className="form-control"
                                        value={cliente.id}
                                        onChange={(e) => setCliente({ ...cliente, id: e.target.value })}
                                    />
                                </div>

                                <div className="col-sm-10">
                                    <label htmlFor="nome" className="form-label">
                                        Nome
                                    </label>
                                    <input id="nome" type="text" className="form-control"
                                        value={cliente.nome}
                                        onChange={(e) => setCliente({ ...cliente, nome: e.target.value })} />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-sm-4">
                                    <label htmlFor="email" className="form-label">
                                        Email
                                    </label>
                                    <input id="email" type="text" className="form-control"
                                        value={cliente.email}
                                        onChange={(e) => setCliente({ ...cliente, email: e.target.value })} />
                                </div>

                                <div className="col-sm-2">
                                    <label htmlFor="telefone" className="form-label">
                                        Telefone
                                    </label>
                                    <input id="telefone" type="text" className="form-control"
                                        value={cliente.telefone}
                                        onChange={(e) => setCliente({ ...cliente, telefone: e.target.value })} />
                                </div>

                                <div className="col-sm-3">
                                    <label htmlFor="cpf" className="form-label">
                                        CPF
                                    </label>
                                    <input id="cpf" type="text" className="form-control"
                                        value={cliente.cpfOuCnpj}
                                        onChange={(e) => setCliente({ ...cliente, cpfOuCnpj: e.target.value })} />
                                </div>

                                <div className="col-sm-3">
                                    <label htmlFor="dataCadastro" className="form-label">
                                        Data de Cadastro
                                    </label>
                                    <input
                                        id="dataCadastro"
                                        type="date"
                                        className="form-control"
                                        value={cliente.dataCadastro}
                                        onChange={(e) => setCliente({ ...cliente, dataCadastro: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Modal footer */}
                        <div className="modal-footer">
                            <button onClick={salvar}
                                id="btn-salvar"
                                type="button"
                                className="btn btn-primary btn-sm"
                            >
                                Salvar
                            </button>
                            <button
                                id="btn-cancelar"
                                type="button"
                                className="btn btn-light btn-sm"
                                data-bs-dismiss="modal"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
