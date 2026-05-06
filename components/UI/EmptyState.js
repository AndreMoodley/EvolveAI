import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Tokens, getTheme } from '../../constants/styles';
import { useTheme } from '../../store/theme-context';

function EmptyState({ icon = 'moon-outline', title, body }) {
  const { theme } = useTheme();
  const t = getTheme(theme);
  return (
    <View style={[styles.wrap, { borderColor: t.hairline }]}>
      <Ionicons name={icon} size={26} color={t.textTertiary} />
      {!!title && <Text style={[Tokens.font.h3, { color: t.textPrimary, marginTop: 10 }]}>{title}</Text>}
      {!!body && (
        <Text style={[Tokens.font.body, { color: t.textTertiary, marginTop: 4, textAlign: 'center' }]}>{body}</Text>
      )}
    </View>
  );
}

export default EmptyState;

const styles = StyleSheet.create({
  wrap: {
    padding: Tokens.spacing.xl,
    borderRadius: Tokens.radius.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
