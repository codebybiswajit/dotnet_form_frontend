import { Stack, Text } from '@fluentui/react'
import React from 'react'

export default function Footer() {
  return (
    <Stack horizontal horizontalAlign='center' style={{backgroundColor : "grey"  ,height :"34px"}}>
      <Text style={{paddingTop :".5em", color : "white"}}>This is a Footer </Text>
    </Stack>
  )
}
