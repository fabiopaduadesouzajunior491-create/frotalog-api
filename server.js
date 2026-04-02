const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'API FROTALOG OK' });
});

// ================= CARGAS =================
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

// ================= ROMANEIO (JSON) =================
app.get('/cargas/:numcar/romaneio-view', (req, res) => {
  const numcar = req.params.numcar;

  const placa = "HNL8J25";
  const motorista = "VILMAR";
  const ajudante1 = "307-WAGNERTAVARES";
  const ajudante2 = "425-RENESRAMON";

  const entregas = [
    { seq: 12, cliente: "DECIO COMERCIO", codcli: 10500, bairro: "ZONA RURAL", pallets: 12, itens: 30, peso: 91.090, volume: 0.122, creditos: 0 },
    { seq: 11, cliente: "MINIMERCADO ORNELAS", codcli: 10198, bairro: "PARQUE SAO JORGE", pallets: 12, itens: 2, peso: 5.200, volume: 0.123, creditos: 2 }
  ];

  let totalItens = 0;
  let totalPeso = 0;
  let totalVolume = 0;

  entregas.forEach(e => {
    totalItens += e.itens;
    totalPeso += e.peso;
    totalVolume += e.volume;
  });

  let html = `
  <html>
  <head>
    <style>
      body { font-family: Arial; font-size: 12px; }
      .topo { display:flex; justify-content:space-between; align-items:center; }
      .titulo { font-size:16px; font-weight:bold; text-align:center; margin:10px 0; }
      table { width:100%; border-collapse: collapse; }
      th, td { border-bottom:1px solid black; padding:4px; }
      th { text-align:left; }
      .red { color:red; font-weight:bold; }
      .linha-topo { margin-top:10px; }
    </style>
  </head>

  <body>

    <div class="topo">
      <div>
        <b>02/04/2026</b><br>
        <b>Placa:</b> ${placa}<br>
        <b>Carga:</b> ${numcar}
      </div>

      <div class="titulo">
        Roteiro de Entregas do Carregamento
      </div>

      <div>
        <img src="https://cdn-icons-png.flaticon.com/512/1995/1995501.png" width="80"><br>
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Iconic_image_of_company_logo_placeholder.png/240px-Iconic_image_of_company_logo_placeholder.png" width="80">
      </div>
    </div>

    <hr>

    <div>
      <b>MOTORISTA:</b> ${motorista} &nbsp;&nbsp;&nbsp;
      <b>AJUDANTE 1:</b> ${ajudante1} &nbsp;&nbsp;&nbsp;
      <b>AJUDANTE 2:</b> ${ajudante2}
    </div>

    <br>

    <table>
      <tr>
        <th>Cliente</th>
        <th>Cód</th>
        <th>Bairro</th>
        <th>Pallet</th>
        <th>Itens</th>
        <th>Peso</th>
        <th>Vol</th>
      </tr>
  `;

  entregas.forEach(e => {
    html += `
      <tr class="${e.creditos > 0 ? 'red' : ''}">
        <td>${e.cliente}</td>
        <td>${e.codcli}</td>
        <td>${e.bairro}</td>
        <td>${e.pallets}</td>
        <td>${e.itens}</td>
        <td>${e.peso.toFixed(3)}</td>
        <td>${e.volume.toFixed(3)}</td>
      </tr>
    `;
  });

  html += `
    </table>

    <br>

    <div>
      <b>Total Geral:</b> 
      ${totalItens} itens | 
      ${totalPeso.toFixed(3)} kg | 
      ${totalVolume.toFixed(3)} m³
    </div>

  </body>
  </html>
  `;

  res.send(html);
});

// ================= ENTREGAS =================
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

// ================= TRANSBORDOS =================
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

// ================= SERVIDOR =================
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});