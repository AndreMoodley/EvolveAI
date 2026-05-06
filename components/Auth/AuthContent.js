import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Tokens, getTheme } from '../../constants/styles';
import { useTheme } from '../../store/theme-context';
import AuthForm from './AuthForm';
import GradientCard from '../UI/GradientCard';
import PressableScale from '../UI/PressableScale';

function AuthContent({ isLogin, onAuthenticate }) {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const t = getTheme(theme);
  const [credentialsInvalid, setCredentialsInvalid] = useState({
    email: false,
    password: false,
    confirmEmail: false,
    confirmPassword: false,
  });

  const switchMode = () => navigation.replace(isLogin ? 'Signup' : 'Login');

  const submit = (creds) => {
    let { email, confirmEmail, password, confirmPassword } = creds;
    email = (email || '').trim();
    password = (password || '').trim();

    const emailIsValid = email.includes('@');
    const passwordIsValid = password.length > 6;
    const emailsAreEqual = email === confirmEmail;
    const passwordsAreEqual = password === confirmPassword;

    if (!emailIsValid || !passwordIsValid || (!isLogin && (!emailsAreEqual || !passwordsAreEqual))) {
      Alert.alert('Invalid Input', 'Check the credentials. The Void demands precision.');
      setCredentialsInvalid({
        email: !emailIsValid,
        confirmEmail: !emailIsValid || !emailsAreEqual,
        password: !passwordIsValid,
        confirmPassword: !passwordIsValid || !passwordsAreEqual,
      });
      return;
    }
    onAuthenticate({ email, password });
  };

  return (
    <ScrollView
      style={{ backgroundColor: t.background }}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={[styles.crest, { borderColor: t.accent, backgroundColor: t.surface }]}>
          <Text style={[styles.crestGlyph, { color: t.accent }]}>伍</Text>
        </View>
        <Text style={[Tokens.font.label, { color: t.accent, marginTop: 14 }]}>EvolveAI · The Void Protocol</Text>
        <Text style={[Tokens.font.display, { color: t.textPrimary, marginTop: 4 }]}>
          {isLogin ? 'Re-enter the Void' : 'Begin Inscription'}
        </Text>
        <Text style={[Tokens.font.body, { color: t.textSecondary, marginTop: 8, textAlign: 'center', lineHeight: 21 }]}>
          {isLogin
            ? 'The protocol awaits. Authenticate to resume the daily strikes.'
            : 'A new practitioner is being inscribed into the ladder of the Seven Realms.'}
        </Text>
      </View>

      <GradientCard colors={[t.surfaceTop, t.surface]}>
        <AuthForm isLogin={isLogin} onSubmit={submit} credentialsInvalid={credentialsInvalid} />
      </GradientCard>

      <PressableScale onPress={switchMode} style={[styles.switch, { borderColor: t.hairline }]}>
        <Ionicons
          name={isLogin ? 'person-add-outline' : 'log-in-outline'}
          size={16}
          color={t.textSecondary}
        />
        <Text style={[Tokens.font.body, { color: t.textSecondary, marginLeft: 8 }]}>
          {isLogin ? 'Inscribe a new practitioner' : 'Existing practitioner — log in'}
        </Text>
      </PressableScale>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

export default AuthContent;

const styles = StyleSheet.create({
  container: { padding: Tokens.spacing.xl, paddingTop: 96 },
  header: { alignItems: 'center', marginBottom: Tokens.spacing.xl },
  crest: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#c91538',
    shadowOpacity: 0.6,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
    elevation: 12,
  },
  crestGlyph: { fontSize: 38, fontWeight: '900' },
  switch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Tokens.spacing.lg,
    paddingVertical: 14,
    borderRadius: Tokens.radius.pill,
    borderWidth: 1,
  },
});
