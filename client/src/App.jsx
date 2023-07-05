import Wallet from "./Wallet";
import Transfer from "./Transfer";
// import "./App.scss";
import { useState } from "react";
import { Flex } from "@chakra-ui/react";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");

  return (
    <Flex
      direction={{ base: "column", lg: "row" }}
      gap={5}
      px={"40px"}
      m={"auto"}
    >
      <Wallet
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
      />
      <Transfer setBalance={setBalance} address={address} />
    </Flex>
  );
}

export default App;
