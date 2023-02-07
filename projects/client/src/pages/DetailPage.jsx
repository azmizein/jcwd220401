import {
  Box,
  Container,
  Stack,
  Text,
  Image,
  Flex,
  Button,
  Heading,
  useColorModeValue,
  Icon,
} from "@chakra-ui/react";

import Axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { IoCartOutline } from "react-icons/io5";
import Swal from "sweetalert2";
import { cartSync } from "../redux/cartSlice";
import { addCart } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";

export default function DetailPage() {
  const params = useParams();
  const [data, setData] = useState();
  const dispatch = useDispatch();
  const [state, setState] = useState("");

  const { email } = useSelector(state => state.userSlice.value);

  const getBook = async () => {
    try {
      const result = await Axios.get(
        `${process.env.REACT_APP_API_BASE}/product/list/${params.id}`,
      );
      // dispatch(syncData(result.data.result));
      // console.log(result.data);
      setData(result.data);
    } catch (err) {
      console.log(err);
    }
  };
  const onAddCart = async ProductId => {
    try {
      if (!email) {
        return Swal.fire({
          icon: "error",
          title: "Akses Ditolak",
          text: "Silahkan Masukan Akun Anda",
          timer: 2000,
          customClass: {
            container: "my-swal",
          },
        });
      }
      // if (cart >= 5) {
      //   return Swal.fire({
      //     icon: "error",
      //     title: "Oooops ...",
      //     text: "Keranjang Penuh",
      //     timer: 2000,
      //     customClass: {
      //       container: "my-swal",
      //     },
      //   });
      // }
      const result = await Axios.post(
        `${process.env.REACT_APP_API_BASE}/cart/add`,
        {
          ProductId,
          UserId: email,
        },
      );
      setState(result.data);
      const res = await Axios.get(
        `${process.env.REACT_APP_API_BASE}/cart/${email}`,
      );
      dispatch(cartSync(res.data));
      dispatch(addCart());
      getBook();

      Swal.fire({
        icon: "success",
        title: "Keranjang Berhasil Ditambahkan",
        text: `${result.data.massage}`,
        timer: 2000,
        customClass: {
          container: "my-swal",
        },
      });
    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${err.response.data}`,
        customClass: {
          container: "my-swal",
        },
      });
    }
  };

  useEffect(() => {
    getBook();
  }, []);

  return (
    <Container h={"710px"}>
      <Flex>
        <Image
          rounded={"md"}
          alt={data?.name}
          src={data?.images}
          fit={"cover"}
          align={"center"}
          w={"100%"}
          h={"300px"}
          border={"1px"}
        />
      </Flex>
      <Stack spacing={{ base: 4, md: 4 }}>
        <Box as={"header"}>
          <Heading
            lineHeight={2}
            fontWeight={"bold"}
            fontSize={"25px"}
          >
            {data?.name}
          </Heading>
          <Text
            color={useColorModeValue("gray.700", "gray.400")}
            fontWeight={"bold"}
            fontSize={"18px"}
          >
            {data?.size}
          </Text>
        </Box>

        <Stack
          spacing={{ base: 1, sm: 1 }}
          direction={"column"}
          // divider={
          //   <StackDivider
          //     borderColor={useColorModeValue("gray.200", "gray.600")}
          //   />
          // }
        >
          <Stack>
            <Text
              color={useColorModeValue("yellow.600", "yellow.300")}
              fontSize={"2xl"}
              fontWeight={"300"}
              textAlign={"left"}
            >
              {data?.category}
            </Text>
          </Stack>

          <Stack></Stack>
          <Box
            bg={useColorModeValue("#ebf5e9")}
            width="auto"
            justifyContent="center"
            borderTopRadius={8}
            borderBottomRadius={8}
            p={3}
          >
            <Text
              color={useColorModeValue("black.200, black.300")}
              fontSize={"18px"}
              // textAlign={"left"}
            >
              {data?.detail ?? "detail kosong"}
            </Text>
          </Box>

          <Box>
            <Text
              fontSize={{ base: "16px", lg: "18px" }}
              color={useColorModeValue("yellow.500", "yellow.300")}
              fontWeight={"500"}
              textTransform={"uppercase"}
              mb={"4"}
              mt={3}
            >
              {data?.price}
              {/* {item.Carts.find((item2) => item2["UserId"] === email) ? (
                        <Button
                          disabled
                          w="full"
                          borderRadius="9px"
                          size="sm"
                          my="5px"
                        >
                          <Icon boxSize="4" as={IoCartOutline} mr="5px" x />
                          Keranjang
                        </Button>
                      ) : (
                      )} */}
              <Button
                onClick={() => onAddCart(data.id)}
                marginLeft={"225px"}
                w="160px"
                borderColor="yellow.400"
                borderRadius="9px"
                borderWidth="2px"
                size="sm"
                my="5px"
                bg={"white"}
                _hover={{ bg: "yellow.400", color: "white" }}
              >
                <Icon
                  boxSize="4"
                  as={IoCartOutline}
                  mr="5px"
                />
                Keranjang
              </Button>
            </Text>
          </Box>
        </Stack>
      </Stack>
    </Container>
  );
}
