import React from "react";
import styled, {css, keyframes} from "styled-components";
import i18next from "i18next";
const pulseAnimation = keyframes`
  0%{
    transform: scale(1);
  }

  50%{
    transform: scale(1.03);
  }

  100%{
    transform: scale(1);
  }
  `
const complexMixin = css`
  animation: ${props=> props.loading ? `${pulseAnimation} 2.25s infinite cubic-bezier(0.66, 0, 0, 0.23)` : '' };
`

const bg = (props) => props.disabled === true ? '#c0bfbf': props.buttonType === 'success' ? '#67C871'
    : props.buttonType === 'fail' ? '#dc3545'
        : props.buttonType === 'blue' ? '#DAE2ED'
            : props.buttonType === 'white' ? '#FFFFFF'
                : props.buttonType === 'secondary' ? '#DADAE1'
                    : '#000000'
const ButtonStyle = styled.button`
  line-height: 24px;
  color: ${ props => props.textColor ? props.textColor : props.type === 'success' ? '#fff'
    : props.buttonType === 'fail' ? '#fff'
        : props.buttonType === 'blue' ? '#000'
            : props.buttonType === 'white' ? '#fff'
                : props.buttonType === 'secondary' ? '#000'
                    :'#fff'};
  font-weight: 400;
  height:${ props => props.size === 'lg' ? '40px' : 
          props.size === 'md' ? '35px' : 
                  props.size === 'sm' ? '30px':
                          props.size === 'xs' ? '29px': 'auto'
};
  border-radius:5px;
  display:inline;
  border:none;
  width:${props => props.full ? '100%' : 'auto'};
  background: ${props => bg(props)};
  min-width: 100px;
  ${ props => props.styles }
  transition-property: opacity;
  transition-timing-function: linear;
  transition-duration: .3s;
  &:hover {
    opacity: 0.8;
    transition-duration: .3s;
  }
    `;

type ButtonTypes = 'success' | 'fail' | 'blue' | 'white' | 'secondary' | 'submit' | 'button' ;
type types = 'submit' | 'button' | 'success' | 'fail' | 'blue' | 'white' | 'secondary';
type ButtonSizes = 'lg' |'md' | 'sm' | 'xs';

interface ButtonProps extends React.HTMLAttributes<HTMLElement> {
    as?: string,
    text?: any,
    testId?: string,
    className?: string,
    class?: string,
    onClick?: (event: React.SyntheticEvent)=> void,
    styles?: React.CSSProperties,
    full?:boolean,
    disabled?:boolean,
    loading?:boolean,
    type?: types,
    buttonType?: ButtonTypes,
    size?: ButtonSizes,
    textColor?: string,
    icon?: React.ReactElement,
}
const Button: React.FC<ButtonProps> = ( props: ButtonProps )=>{

    const {
        as='button',
        text,
        testId='',
        type='',
        className='',
        onClick,
        styles,
        full=false,
        loading=false,
        icon,
        textColor = null,
        disabled=false,
        size='',
        buttonType=''
        } = props
    // @ts-ignore
    // const tt = buttonType === 'submit' ? 'submit' :  buttonType === 'button' ? 'button' : type

    return (
        <ButtonStyle
            onClick={ onClick }
            type={type}
            buttonType={buttonType}
            disabled={disabled}
            full={full}
            text={text}
            styles={styles}
            textColor={textColor}
            size={size}
            loading={loading}
            className={`${className ? className : props.class ? props.class : ''}`}
            data-testid={testId}
        >
            { text ?
                <span className='font-10'>{icon ? icon : ''}{typeof text === 'string' ? i18next.t(text) : text}</span>
                : props.children
            }
        </ButtonStyle>
    )
}

export default Button;
