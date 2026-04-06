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
      motorista_entrega: { external_id: 101, nome: "JOAO" },
      motorista_transbordo: { external_id: 202, nome: "CARLOS" },
      veiculo_principal: "ABC-1234",
      julietas: ["DEF-5678", "GHI-9999"]
    }
  ]);
});

// ================= ROMANEIO =================
app.get('/cargas/:numcar/romaneio-view', (req, res) => {
  const numcar = req.params.numcar;

  const entregas = [
    { codcli: 10500, cliente: "DECIO COMERCIO", bairro: "ZONA RURAL", pallets: 12, itens: 30, peso: 91.090, volume: 0.122, creditos: 0 },
    { codcli: 10198, cliente: "MINIMERCADO ORNELAS", bairro: "PARQUE SAO JORGE", pallets: 12, itens: 2, peso: 5.200, volume: 0.123, creditos: 2 }
  ];

  // 🔥 CALCULAR TOTAIS
  let totalItens = 0;
  let totalPeso = 0;
  let totalVolume = 0;
  let totalEntregas = entregas.length;

  entregas.forEach(e => {
    totalItens += e.itens;
    totalPeso += e.peso;
    totalVolume += e.volume;
  });

  let html = `
  <html>
  <body style="font-family:Arial;background:#f4f6f9;margin:0">

    <div style="background:#3A209D;color:white;padding:15px">
      <h2>Carga ${numcar}</h2>
    </div>

    <div style="padding:10px">
  `;

  entregas.forEach(e => {
    html += `
      <div style="background:white;margin-bottom:5px;padding:10px">
        <b>${e.codcli} - ${e.cliente}</b> - ${e.bairro} |
        ${e.pallets} pallet | ${e.itens} itens | ${e.peso} kg
      </div>
    `;
  });

  // 🔥 LINHA DE TOTAL
  html += `
      <div style="background:#eee;padding:12px;margin-top:10px;font-weight:bold;border-radius:5px">
        TOTAL: ${totalEntregas} entregas | 
        ${totalItens} itens | 
        ${totalPeso.toFixed(2)} kg | 
        ${totalVolume.toFixed(3)} m³
      </div>
  `;

  html += `
    </div>
  </body>
  </html>
  `;

  res.send(html);
});

// ================= ENTREGAS (COM GEO) =================
app.get('/entregas', (req, res) => {
  const entregas = [
    {
      numcar: 12345,
      seq_rota: 1,
      cliente: "SUPERMERCADO XYZ",
      endereco: "RUA A, 123",
      bairro: "CENTRO",
      cidade: "MONTE CARMELO",

      lat: -18.724,
      lng: -47.491,

      paletes: 3,
      valor_total: 1500.50
    }
  ];

  res.json(entregas);
});

// ================= TRANSBORDOS =================
app.get('/transbordos', (req, res) => {
  res.json([
    {
      numcar: 12345,
      cidade_origem: "UBERLANDIA",
      cidade_destino: "ARAGUARI",
      motorista_transbordo: { nome: "CARLOS" },
      motorista_entrega: { nome: "JOAO" },
      cavalo: "ABC-1234"
    }
  ]);
});

// ================= SERVIDOR =================
app.listen(process.env.PORT || 3000, () => {
  console.log('Servidor rodando');
});