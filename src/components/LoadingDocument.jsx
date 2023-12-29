import { Box, Loader, Text } from "@mantine/core";

const LoadingDocument = () => {
  return (
    <Box pt={200} mx={"auto"} w={"fit-content"}>
      <Box>
        <Loader color="blue" type="bars" mx={"auto"} />
      </Box>
      <Text mt={"md"}>Loading your document...</Text>
    </Box>
  );
};

export default LoadingDocument;
