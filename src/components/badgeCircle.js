import React from "react";
import styled from "styled-components";

const BadgeCircle = ( {as='span', text='', status=''} )=>{
    const Container = styled(as)`
  line-height: 24px;
  color: #000000;
  // font-size: .6rem;
  font-weight: 400;
  padding:4px 11px 12px;
  border-radius:50%;
  display:inline-block;
  width:32px;
  height:32px;
      text-transform: capitalize;
  background: ${ status === 'success' ? 'rgba(92, 189, 124, 0.08)'
        : status === 'fail' ? 'rgba(193, 7, 7, 0.08)'
        : status === 'basic' ? '#E1EBFF' : '#E5E5E5'}
       
    `;
    return (
        <Container>
            {text}
        </Container>
    )
}

export default BadgeCircle;
