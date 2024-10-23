const express = require('express');
const router = express.Router();
const sql = require('mssql');

router.get('/getService', async(req,res) => {
  try{
    const result = await sql.query("SELECT * FROM ServiceAgreement ");
    return res.json(result.recordset);
  }catch(err){
    return res.json(err);
  }
});

router.get('/ServiceStatus', async(req,res) => {
  try{
    const result = await sql.query("SELECT DISTINCT Status FROM ServiceAgreement");
    return res.json(result.recordset);
  }catch(err){
    return res.json(err);
  }
});

router.get('/ServiceRenew', async(req,res) => {
  try{
    const result = await sql.query("SELECT DISTINCT Renew FROM ServiceAgreement");
    return res.json(result.recordset);
  }catch(err){
    return res.json(err);
  }
});

router.get('/service/:id', async (req, res) => {
  const AgreementID = req.params.id;

  try {
    const result = await sql.query`SELECT * FROM ServiceAgreement WHERE AgreementID = ${AgreementID}`;
    return res.json(result.recordset[0]);
  } catch (err) {
    return res.json(err);
  }
});

module.exports = router;