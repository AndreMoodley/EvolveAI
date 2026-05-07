import { useState } from 'react';
import { Pressable, Text, View, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCinematic } from '../../hooks/useCinematic';
import { useTheme } from '../../store/theme-context';
import { getTheme, Tokens } from '../../constants/styles';

export default function CinematicShareButton({
  compositionId,
  buildProps,
  label = 'Render Cinematic',
  icon = 'sparkles-outline',
  shareMessage,
  variant = 'primary',
}) {
  const [busy, setBusy] = useState(false);
  const { renderAndShare } = useCinematic();
  const { theme } = useTheme();
  const t = getTheme(theme);

  const handlePress = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const props = typeof buildProps === 'function' ? buildProps() : buildProps;
      await renderAndShare(compositionId, props, shareMessage);
    } catch (e) {
      Alert.alert('Cinematic failed', e.message ?? 'Could not render. Try again.');
    } finally {
      setBusy(false);
    }
  };

  const styles = makeStyles(t, variant);
  return (
    <Pressable
      onPress={handlePress}
      disabled={busy}
      style={({ pressed }) => [styles.button, pressed && styles.pressed, busy && styles.disabled]}
    >
      <View style={styles.row}>
        {busy ? (
          <ActivityIndicator size="small" color={variant === 'primary' ? t.background : t.accent} />
        ) : (
          <Ionicons name={icon} size={18} color={variant === 'primary' ? t.background : t.accent} />
        )}
        <Text style={styles.label}>{busy ? 'Rendering…' : label}</Text>
      </View>
    </Pressable>
  );
}

const makeStyles = (t, variant) =>
  StyleSheet.create({
    button: {
      paddingVertical: 14,
      paddingHorizontal: 20,
      borderRadius: Tokens.radius.pill,
      backgroundColor: variant === 'primary' ? t.accent : 'transparent',
      borderWidth: variant === 'primary' ? 0 : 1,
      borderColor: t.accent,
      alignItems: 'center',
      justifyContent: 'center',
    },
    pressed: { opacity: 0.85 },
    disabled: { opacity: 0.5 },
    row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    label: {
      ...Tokens.font.label,
      fontSize: 12,
      color: variant === 'primary' ? t.background : t.accent,
    },
  });
