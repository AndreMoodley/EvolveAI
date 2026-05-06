import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Tokens, getTheme } from '../../constants/styles';
import { useTheme } from '../../store/theme-context';

function Input({ label, keyboardType, secure, onUpdateValue, value, isInvalid }) {
  const { theme } = useTheme();
  const t = getTheme(theme);

  return (
    <View style={styles.wrap}>
      <Text style={[Tokens.font.label, { color: isInvalid ? t.error : t.textTertiary }]}>{label}</Text>
      <TextInput
        autoCapitalize="none"
        keyboardType={keyboardType}
        secureTextEntry={secure}
        onChangeText={onUpdateValue}
        value={value}
        placeholderTextColor={t.textTertiary}
        style={[
          styles.input,
          Tokens.font.h3,
          {
            backgroundColor: t.surface,
            color: t.textPrimary,
            borderColor: isInvalid ? t.error : t.hairline,
          },
        ]}
      />
    </View>
  );
}

export default Input;

const styles = StyleSheet.create({
  wrap: { marginVertical: 8 },
  input: {
    marginTop: 6,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: Tokens.radius.md,
    borderWidth: 1,
  },
});
