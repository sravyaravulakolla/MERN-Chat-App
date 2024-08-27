import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'

const Login = () => {
    const [show, setShow]= useState(false);
    const [name, setName]=useState();
    const [email, setEmail]=useState();
    const [password, setPassword]=useState();
    const handleClick=()=>{
        setShow(!show);
    };
    const postDetails=(pic)=>{

    };
    const submitHandler=()=>{
        
    }
  return (
    <VStack spacing={"5px"}>
      <FormControl id="first-name" isRequired>
        <FormLabel>
            Name
        </FormLabel>
        <Input placeholder='Enter your Name'
        onChange={(e)=>setName(e.target.value)}/>
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>
            Email
        </FormLabel>
        <Input placeholder='Enter your Email'
        onChange={(e)=>setEmail(e.target.value)}/>
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>
            Password
        </FormLabel>
        <InputGroup size="md">
            <Input type={show?"text":"password"} placeholder='Enter your password' onChange={(e)=>setPassword(e.target.value)}/>
            <InputRightElement width={"4.5rem"}>
                <Button h="1.75rem" size={"sm"} onClick={handleClick}>
                    {show?"Hide":"Show"}
                </Button>
            </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button colorScheme='blue' width={"100%"} style={{marginTop: 15}} onClick={submitHandler}>
        Login
      </Button>
    </VStack>
  )
}

export default Login
