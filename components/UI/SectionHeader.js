import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Tokens, getTheme } from '../../constants/styles';
import { useTheme } from '../../store/theme-context';

function SectionHeader({ label, title, accent, right }) {
  const { theme } = useTheme();
  const t = getTheme(theme);
  return (
    <View style={styles.wrap}>
      <View style={{ flex: 1 }}>
        {!!label && (
          <Text style={[Tokens.font.label, { color: accent || t.accent, marginBottom: 4 }]}>
            {label}
          </Text>
        )}
        {!!title && <Text style={[Tokens.font.title, { color: t.textPrimary }]}>{title}</Text>}
      </View>
      {right}
    </View>
  );
}

export default SectionHeader;

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: Tokens.spacing.xl,
    marginBottom: Tokens.spacing.md,
  },
});
