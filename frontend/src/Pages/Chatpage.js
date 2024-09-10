import React from 'react'
import { chatState } from '../Context/ChatProvider'
import { Box } from '@chakra-ui/react';

const Chatpage = () => {
  const {user} = chatState();
  return (
    <div style={{width:"100%"}}>
      {/* {user && </SideDrawer/>} */}
      <Box>
        {user && <MyChats/>}
      </Box>
    </div>
  )
}

export default Chatpage
