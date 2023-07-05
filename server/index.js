const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

const privateKey = secp.secp256k1.utils.randomPrivateKey();
const publicKey = secp.secp256k1.getPublicKey(privateKey);

// console.log(toHex(privateKey), toHex(publicKey));

const message = toHex(secp.secp256k1.CURVE.hash("Suraj"));

// const sig = secp.secp256k1.sign(message, privateKey, { recovery: true });

// const sign = new secp.secp256k1.Signature(
//   2033630933762696605541161575790206731053690621644990335847047981497058368803n,
//   44691677694009762415188352048753022950941460634409648318350333846945329921689n,
//   1
// );
// console.log(
//   secp.secp256k1.verify(
//     sign,
//     message,
//     "02b1cd931987c4f6b7f6ea189d7fe54cec0d52f58840299e57b14407d69742ff5f"
//   )
// );

// console.log(toHex(sign.recoverPublicKey(message).toRawBytes()));

// const recoverKey = sig.recoverPublicKey(message).toRawBytes();
// const recoverKey = signature.recoverPublicKey(message).toRawBytes();
// console.log(secp.secp256k1.verify(sig, message, publicKey));
// console.log(toHex(recoverKey), toHex(publicKey));
// console.log(toHex(publicKey), toHex(recoverKey));

// console.log(
//   toHex(keccak256(privateKey)),
//   toHex(keccak256(privateKey.slice(1))),
//   sig
// );

app.use(cors());
app.use(express.json());

const balances = {
  "033ffbe3c38c9ab2e58060ec215b63ba1182ad5baaff9c44e33a23e8e66dcacb9a": 50,
  "03ac373b23a8cd992d776043cd336bcafa72f7d84d3eac159a7df8d96f118c5ebb": 75,
  "02b1cd931987c4f6b7f6ea189d7fe54cec0d52f58840299e57b14407d69742ff5f": 80,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", async (req, res) => {
  const { sender, recipient, amount, signature } = req.body;
  console.log(signature);
  const r = BigInt(signature.signatureR.split("n")[0]);
  const s = BigInt(signature.signatureS.split("n")[0]);

  const sign = new secp.secp256k1.Signature(r, s, 0);
  const verification = await secp.secp256k1.verify(sign, message, sender);

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else if (verification) {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  } else {
    res.send({ message: "Invalid Signatures" });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
