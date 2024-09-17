import React from 'react'
import { useChatState } from '../Context/ChatProvider'
import { Box, IconButton, Text } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';

const SingleChat = ({fetchAgain, setFetchAgain}) => {
    const {user, selectedChat, setSelectedChat}= useChatState();
  return (
    <>
      {selectedChat?(
        <>
        <Text>
            <IconButton display={{base:"flex" , md:"none"}} icon={<ArrowBackIcon/>}
            onClick={()=>setSelectedChat("")}/>
        </Text>
        </>
      ):(
        <Box display={"flex"} alignItems={"center"} justifyContent={"center"} 
        h={"100%"}>
            <Text fontSize={"3xl"} pb={3} fontFamily={"Work sans"}>
            Click on a user to start chatting
            </Text>
        </Box>
      )}
    </>
  )
}

export default SingleChat
