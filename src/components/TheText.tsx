import React from 'react';
import {Text, TextProps, StyleSheet} from 'react-native';

type CustomTextProps = TextProps & {
  defaultColor?: string;
};

const TheText: React.FC<CustomTextProps> = ({
  defaultColor = 'black',
  style,
  ...props
}) => {
  const mergedStyles = StyleSheet.flatten([{color: defaultColor}, style]);

  return <Text {...props} style={mergedStyles} />;
};

export default TheText;
