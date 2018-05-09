import React, { createElement } from 'react';
import { TouchableOpacity, TouchableWithoutFeedback, TouchableNativeFeedback, Platform } from 'react-native';
import { string, bool, func, oneOf, number } from 'prop-types';
import Text from '../text';
import Icon from '../icon';
import styles from './Button.style';

const Button = ({
  children = 'Button Text',
  disabled,
  onPress,
  color = 'transparent',
  silent = false,
  icon,
  textColor,
  size = 'md',
  padding,
  paddingX = 15,
  paddingY = 10,
  accessible = true,
  accessibilityLabel,
  accessibilityRole = 'button',
}) => {
  const textColors = {
    red: 'white',
    green: 'white',
    blue: 'white',
    white: 'black',
    transparent: 'black',
    disabled: 'white',
  };

  const textSizes = {
    sm: 'xs',
    md: 'sm',
    lg: 'md',
  };

  const child = ( icon != null ) ? (
    <Icon
      color={textColor || textColors[color]}
      name={icon}
      size={size}
    />
  ) : ( typeof children === 'string' ) ? (
    <Text
      color={textColor || textColors[color]}
      decoration="none"
      size={textSizes[size]}
    >
      {children}
    </Text>
  ) : (
    children
  );

  return createElement(
    silent
      ? TouchableWithoutFeedback
      : (
        Platform.OS === 'android'
          ? TouchableNativeFeedback
          : TouchableOpacity
      ),
    {
      disabled,
      onPress,
      accessible,
      accessibilityLabel,
      accessibilityRole,
      style: [
        disabled ? styles.disabled : styles[color],
        {
          padding,
          paddingHorizontal: paddingX,
          paddingVertical: paddingY,
        },
      ],
    },
    child
  );
};

Button.propTypes = {
  children: string,
  disabled: bool,
  onPress: func,
  color: oneOf(
    ['red', 'blue', 'green', 'white', 'transparent']
  ).isRequired,
  textColor: oneOf(
    ['white', 'black']
  ),
  silent: bool,
  icon: string,
  size: oneOf(
    ['sm', 'md', 'lg']
  ),
  padding: number,
  paddingX: number,
  paddingY: number,
  accessibilityLabel: string,
  accessibilityRole: string,
  accessible: bool,
};

export default Button;
