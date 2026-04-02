const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'API FROTALOG OK' });
});

app.get('/cargas', (req, res) => {
  res.json([
    {
      numcar: 12345,
      tipo: "TRANSBORDO",

      motorista_entrega: {
        external_id: 101,
        nome: "JOAO"
      },

      motorista_transbordo: {
        external_id: 202,
        nome: "CARLOS"
      },

      veiculo_principal: "ABC-1234",
      julietas: ["DEF-5678", "GHI-9999"]
    }
  ]);
});
app.get('/cargas/:numcar/romaneio', (req, res) => {
  const numcar = req.params.numcar;

  res.json({
    carga: numcar,
    placa: "HNL8J25",
    motorista: "VILMAR",
    ajudante1: "WAGNER",
    ajudante2: "RENE",
    entregas: [
      {
        codcli: 101,
        cliente: "DECIO COMERCIO",
        bairro: "ZONA RURAL",
        seq: 1,
        pallets: 12,
        itens: 30,
        peso: 91.09,
        volume: 0.122,
        creditos: 0
      },
      {
        codcli: 102,
        cliente: "MINIMERCADO ORNELAS",
        bairro: "PARQUE SAO JORGE",
        seq: 2,
        pallets: 5,
        itens: 10,
        peso: 30,
        volume: 0.05,
        creditos: 2
      }
    ]
  });
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
app.get('/entregas', (req, res) => {
  res.json([
    {
      numcar: 12345,
      seq_rota: 1,
      cliente: "SUPERMERCADO XYZ",
      endereco: "RUA A, 123",
      bairro: "CENTRO",
      cidade: "MONTE CARMELO",
      telefone: "34999999999",

      paletes: 3,
      valor_total: 1500.50,

      observacao: "ENTREGAR NO FUNDO"
    }
  ]);
});
app.get('/transbordos', (req, res) => {
  res.json([
    {
      numcar: 12345,

      cidade_origem: "UBERLANDIA",
      cidade_destino: "ARAGUARI",

      motorista_transbordo: {
        nome: "CARLOS"
      },

      motorista_entrega: {
        nome: "JOAO"
      },

      cavalo: "ABC-1234",
      julieta_1: "DEF-5678",
      julieta_2: "GHI-9999"
    }
  ]);
});
