import React from 'react';
import { Text as NativeText, Platform } from 'react-native';
import { string, number, oneOf, oneOfType, bool } from 'prop-types';

const textSizes = {
  xxs: 12,
  xs: 14,
  sm: 16,
  md: 18,
  lg: 20,
  xl: 24,
  xxl: 32,
};

const colors = {
  black: 'black',
  green: 'green',
  red: 'red',
  blue: 'blue',
  white: 'white',
  transparent: 'transparent',
};

const Text = ({
  children,
  color = 'black',
  decoration = 'none',
  fontWeight,
  height,
  size = 'sm',
  align,
  width,
  bold,
  fontFamily,
  text,
  ...restProps
}) => {
  const style = {
    textDecorationLine: decoration,
    fontWeight: bold ? 'bold' : fontWeight,
    height,
    fontSize: textSizes[size],
    textAlign: align,
    width,
    color: colors[color] || color,
    fontFamily: fontFamily || Platform.select({
      web: 'system-ui, sans-serif',
      native: 'System',
    }),
  };

  return (
    <NativeText
      {...restProps}
      style={[
        style,
      ]}
    >
      {text || children}
    </NativeText>
  );
};

Text.propTypes = {
  text: string,
  color: string,
  decoration: oneOf(
    ['none']
  ),
  fontWeight: string,
  size: string,
  height: oneOfType(
    [number, string]
  ),
  children: oneOfType(
    [number, string]
  ),
  align: oneOf(
    ['auto', 'left', 'right', 'center', 'justify']
  ),
  width: oneOfType(
    [number, string]
  ),
  bold: bool,
  fontFamily: string,
};

export default Text;
