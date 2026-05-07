import React, { useRef } from 'react';
import { Animated, Pressable } from 'react-native';

function PressableScale({ children, onPress, style, scale = 0.97, hitSlop = 8 }) {
  const animated = useRef(new Animated.Value(1)).current;

  const onIn = () =>
    Animated.spring(animated, { toValue: scale, useNativeDriver: true, friction: 8, tension: 220 }).start();
  const onOut = () =>
    Animated.spring(animated, { toValue: 1, useNativeDriver: true, friction: 5, tension: 200 }).start();

  return (
    <Pressable onPress={onPress} onPressIn={onIn} onPressOut={onOut} hitSlop={hitSlop}>
      <Animated.View style={[{ transform: [{ scale: animated }] }, style]}>{children}</Animated.View>
    </Pressable>
  );
}

export default PressableScale;
