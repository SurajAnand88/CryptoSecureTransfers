import server from "./server";
import { Box, Flex, Input, Text } from "@chakra-ui/react";

function Wallet({ address, setAddress, balance, setBalance }) {
  async function onChange(evt) {
    const address = evt.target.value;
    setAddress(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    // <div className="container wallet">
    <Box
      boxShadow={"0 1px 2px 0 rgba(0, 0, 0, 0.05)"}
      bg={"white"}
      // p={8}
      borderRadius={8}
      w={"full"}
    >
      <Flex direction={"column"} px={6} align={"center"}>
        <Text color={"black"} fontWeight={"bold"} fontSize={"34px"}>
          Your Wallet
        </Text>
        <Input
          w={"97%"}
          bg={"#010164"}
          placeholder="Type an address, for example: 0x1"
          value={address}
          onChange={onChange}
        ></Input>

        <Text bg={"teal"} p={2} w={"100%"}>
          Balance: {balance}
        </Text>
      </Flex>
    </Box>
  );
}

export default Wallet;
