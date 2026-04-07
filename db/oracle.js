const oracledb = require('oracledb');

async function getConnection() {
  return await oracledb.getConnection({
    user: "FMARTINS",
    password: "FMARTINS",
    connectString: `(DESCRIPTION =
      (ADDRESS = (PROTOCOL = TCP)(HOST = 10.1.1.210)(PORT = 1521))
      (CONNECT_DATA =
        (SID = WINT)
      )
    )`
  });
}

module.exports = { getConnection };