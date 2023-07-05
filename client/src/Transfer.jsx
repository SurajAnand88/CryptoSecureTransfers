import { useState } from "react";
import server from "./server";
import { AbsoluteCenter, Flex, Text } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Box,
  Button,
  Center,
  useToast,
} from "@chakra-ui/react";

function Transfer({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [signature, setSignature] = useState({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    try {
      const {
        data: { balance, message },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
        signature,
      });
      console.log(balance);
      balance
        ? (() => {
            setBalance(balance);
            onClose();
            toast({
              title: "Payment Success.",
              description: `Payment of ${sendAmount} has been successfully processed`,
              status: "success",
              duration: 2000,
              isClosable: true,
            });
          })()
        : toast({
            title: "Something went wrong",
            description: `${message}`,
            status: "error",
            duration: 2000,
            isClosable: true,
          });
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <>
      <Box
        boxShadow={"0 1px 2px 0 rgba(0, 0, 0, 0.05)"}
        bg={"white"}
        py={8}
        borderRadius={8}
        w={"full"}
      >
        {/* <form className="container transfer" onSubmit={transfer}> */}
        <Flex direction={"column"} align={"center"} px={2}>
          <Text color={"black"} fontWeight={"bold"} fontSize={"34px"}>
            Send Transaction
          </Text>
          <Text color={"black"}>Send Amount</Text>
          <Input
            w={"90%"}
            bg={"#010164"}
            placeholder="1, 2, 3..."
            value={sendAmount}
            onChange={setValue(setSendAmount)}
          ></Input>

          <Text color={"black"}>Recipent</Text>
          <Input
            w={"90%"}
            bg={"#010164"}
            placeholder="Type an address, for example: 0x2"
            value={recipient}
            onChange={setValue(setRecipient)}
          ></Input>

          <Input
            bg={"teal"}
            mt={3}
            w={"95%"}
            type="submit"
            className="button"
            value="Transfer"
            onClick={onOpen}
          />
        </Flex>
        {/* </form> */}
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Input Your Singnature</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormLabel>Signature r</FormLabel>
            <Input
              placeholder="Signature r"
              w={"90%"}
              name="signatureR"
              onChange={(e) => {
                setSignature({ ...signature, [e.target.name]: e.target.value });
              }}
            />

            <FormLabel>Signature s</FormLabel>
            <Input
              placeholder="Signature s"
              name="signatureS"
              w={"90%"}
              onChange={(e) => {
                setSignature({ ...signature, [e.target.name]: e.target.value });
              }}
            />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="green" m={"auto"} onClick={transfer}>
              Confirm Payment
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Transfer;
