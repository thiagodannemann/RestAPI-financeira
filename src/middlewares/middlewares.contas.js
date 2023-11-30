const { banco, contas } = require('../database');
const { encontrarContaPeloEmail, verificarDigitosCPF, encontrarContaPeloCPF, encontrarContaPeloNumero } = require('../helpers/helpers');

const validarSenhaBanco = (req, res, next) => {
  const { senha_banco } = req.query;

  const senhaDigitada = senha_banco;
  const senhaCorreta = banco.senha;

  if (senha_banco === "" || senha_banco === undefined) {
    res.status(401).json({ mensagem: "Por favor insira a senha do banco." })
  }
  if (senhaDigitada === senhaCorreta) {
    next();
  } else {
    res.status(401).json({ mensagem: "A senha do banco informada é inválida!" })
  }
};

const validacaoParaExtratos = (req, res, next) => {
  const { numero_conta, senha } = req.query;

  if (!numero_conta) {
    return res.status(400).json({ mensagem: "Por favor insira o número da conta." })
  }

  if (!senha) {
    return res.status(400).json({ mensagem: "Por favor insira o número da conta." })
  }

  const contaEncontrada = contas.find((conta) => {
    return conta.numeroConta === Number(numero_conta);
  });

  if (!contaEncontrada) {
    return res.status(404).json({ mensagem: "Esse número de conta não existe!" })
  }

  const senhaCorreta = contaEncontrada.usuario.senha === senha;

  if (!senhaCorreta) {
    return res.status(401).json({ mensagem: "A senha do banco informada é inválida!" })
  }
  next();

};

const validacaoParaExibirSaldo = (req, res, next) => {
  const { numero_conta, senha } = req.query;

  if (!numero_conta) {
    return res.status(400).json({ mensagem: "Por favor insira o número da conta." })
  }

  if (!senha) {
    return res.status(400).json({ mensagem: "Por favor insira o número da conta." })
  }

  const contaEncontrada = contas.find((conta) => {
    return conta.numeroConta === Number(numero_conta);
  });

  if (!contaEncontrada) {
    return res.status(404).json({ mensagem: "Esse número de conta não existe!" })
  }

  const senhaCorreta = contaEncontrada.usuario.senha === senha;

  if (!senhaCorreta) {
    return res.status(401).json({ mensagem: "A senha do banco informada é inválida!" })
  }
  next();

};

const validacaoParaCriarConta = (req, res, next) => {
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
  if (!nome) {
    return res.status(400).json({ mensagem: "Por favor preencha o nome!" })
  }
  if (!cpf) {
    return res.status(400).json({ mensagem: "Por favor preencha o cpf!" })
  }
  if (!data_nascimento) {
    return res.status(400).json({ mensagem: "Por favor preencha a data de nascimento!" })
  }
  if (!telefone) {
    return res.status(400).json({ mensagem: "Por favor preencha o telefone!" })
  }
  if (!email) {
    return res.status(400).json({ mensagem: "Por favor insira o e-mail!" })
  }
  if (!senha) {
    return res.status(400).json({ mensagem: "Por favor insira a senha!" })
  }

  const foiVerificadoCPF = verificarDigitosCPF(cpf);

  if (!foiVerificadoCPF) {
    return res.status(400).json({ mensagem: "Por favor insira apenas os números do cpf!" })
  } else {
    const contaEncontradaPeloCPF = encontrarContaPeloCPF(cpf);
    if (contaEncontradaPeloCPF) {
      return res.status(400).json({ mensagem: "Já possui um cadastro com esse CPF." })
    }
  }
  const contaEncontradaPeloEmail = encontrarContaPeloEmail(email);

  if (contaEncontradaPeloEmail) {
    return res.status(400).json({ mensagem: "Já existe uma conta existente com o e-mail informado." })
  }
  next();
};

const validacaoParaEditarConta = (req, res, next) => {
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
  const { numeroConta } = req.params;

  const contaEncontradaPeloNumero = encontrarContaPeloNumero(numeroConta);

  if (!contaEncontradaPeloNumero) {
    return res.status(404).json({ mensagem: "Esse número de conta não existe!" })
  }

  if (nome || cpf || data_nascimento || telefone || email || senha) {

    if (cpf) {
      const foiVerificadoCPF = verificarDigitosCPF(cpf);

      if (!foiVerificadoCPF) {
        return res.status(400).json({ mensagem: "Por favor insira apenas os números do cpf!" })
      }
      const contaEncontradaPeloCPF = encontrarContaPeloCPF(cpf);

      if (contaEncontradaPeloCPF) {
        return res.status(400).json({ mensagem: "Já existe uma conta cadastrada com esse CPF!" })
      }
    }

    if (email) {
      const contaEncontradaPeloEmail = encontrarContaPeloEmail(email);
      if (contaEncontradaPeloEmail) {
        return res.status(400).json({ mensagem: "Já existe uma conta cadastrada com esse e-mail!" })
      }
    }

    next();

  } else {
    return res.status(400).json({ mensagem: "Por favor preencha pelo menos 1 ou mais campos para serem modificados: nome, CPF, data de nascimento, telefone, email ou senha" })
  }

}

const validacaoParaDeletarConta = (req, res, next) => {
  const { numeroConta } = req.params;
  const contaEncontrada = encontrarContaPeloNumero(numeroConta);

  if (!contaEncontrada) {
    return res.status(400).json({ mensagem: "Conta não encontrada." })
  }

  const saldoDaConta = contaEncontrada.saldo;

  if (saldoDaConta !== 0) {
    return res.status(400).json({ mensagem: "O saldo deve estar zerado para deletar a conta." })
  }
  next();
}

module.exports = {
  validarSenhaBanco,
  validacaoParaExtratos,
  validacaoParaExibirSaldo,
  validacaoParaCriarConta,
  validacaoParaEditarConta,
  validacaoParaDeletarConta
};