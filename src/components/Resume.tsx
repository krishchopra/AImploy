import { ChakraProvider, Box, Text, Button, Flex } from "@chakra-ui/react";
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import job from '../assets/job.png';
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

function Resume() {
  const [pdfFile, setPdfFile] = useState(null); // State to store the PDF file
  const [pdfUrl, setPdfUrl] = useState(null); // State to store the PDF URL for preview
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(null);

  const onFileDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const fileUrl = URL.createObjectURL(file);
    setPdfFile(file);
    setPdfUrl(fileUrl);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop: onFileDrop });

  const handleReplacePdf = () => {
    setPdfFile(null);
    setPdfUrl(null);
  };

  const handleSubmitPdf = async () => {
    console.log("Submitting PDF:", pdfFile);

    if (!pdfFile) {
      console.error("No PDF file provided");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", pdfFile);

      const response = await axios.post("http://127.0.0.1:5000/resume", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setScore(response.data.score);
      setFeedback(response.data.feedback);
    } catch (error) {
      console.error("Error submitting PDF:", error);
      setFeedback("There was an error submitting your PDF.");
    }
  };

  return (
    <ChakraProvider>
      <Navbar />
      <Box
        sx={{
          width: '100vw',
          height: '91vh',
          backgroundImage: `url(${job})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          paddingLeft: '3vw', // Move to the left
        }}
      >
        <Box>
        <Text fontSize="3xl" fontWeight="bold" marginBottom="10px" marginTop="15px">Resume Feedback</Text> {/* Title */}
          <Box width="800px" height="750px" marginBottom="100px" my="auto">
            {pdfUrl ? (
              <iframe src={pdfUrl} title="Uploaded PDF" width="100%" height="100%" frameBorder="0" />
            ) : (
              <Box {...getRootProps()} textAlign="center" border="2px" borderRadius="md" p="20px" cursor="pointer">
                <input {...getInputProps()} accept=".pdf" />
                {isDragActive ? (
                  <Text>Drop the PDF file here ...</Text>
                ) : (
                  <Text>Upload The PDF File here!</Text>
                )}
              </Box>
            )}
          </Box>
          <Button marginTop="30px" width="350px" mx="auto" colorScheme="teal" onClick={handleReplacePdf}>Replace PDF</Button>
          <Button marginTop="30px" width="350px" float="right" mx="auto" colorScheme="teal" onClick={handleSubmitPdf}>Submit PDF</Button>
        </Box>

        {feedback && (
          <Box
            width="500px"
            height="700px"
            backgroundColor="white"
            border="1px solid gray"
            boxShadow="md"
            borderRadius="md"
            p="4"
            position="absolute"
            top="56%"
            right="12vw"
            transform="translateY(-50%)"
          >
            <Text fontSize="xl" fontWeight="bold" mb="4">Score: {score}</Text>
            <Text>{feedback}</Text>
          </Box>
        )}

          <Flex
            position="absolute"
            bottom="20px"
            right="20px"
            justifyContent="flex-end"
            gap="10px"
          >
            <Button
              as={Link}
              to="/user" // Replace with the actual path of your previous page
              colorScheme="blue"
              bg="blue.500"
              color="white"
              _hover={{ bg: "blue.600" }}
            >
              Previous
            </Button>
            <Button
              as={Link}
              to="/letter" // Replace with the actual path of your next page
              colorScheme="blue"
              bg="blue.500"
              color="white"
              _hover={{ bg: "blue.600" }}
            >
              Next
            </Button>
          </Flex>

      </Box>
    </ChakraProvider>
  );
}

export default Resume;
