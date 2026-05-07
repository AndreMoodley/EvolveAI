import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Tokens, getTheme } from '../../constants/styles';
import { useTheme } from '../../store/theme-context';
import Input from './Input';
import PressableScale from '../UI/PressableScale';

function AuthForm({ isLogin, onSubmit, credentialsInvalid }) {
  const { theme } = useTheme();
  const t = getTheme(theme);
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const submit = () => onSubmit({ email, confirmEmail, password, confirmPassword });

  return (
    <View>
      <Input
        label="Email"
        keyboardType="email-address"
        value={email}
        onUpdateValue={setEmail}
        isInvalid={credentialsInvalid.email}
      />
      {!isLogin && (
        <Input
          label="Confirm Email"
          keyboardType="email-address"
          value={confirmEmail}
          onUpdateValue={setConfirmEmail}
          isInvalid={credentialsInvalid.confirmEmail}
        />
      )}
      <Input
        label="Password"
        secure
        value={password}
        onUpdateValue={setPassword}
        isInvalid={credentialsInvalid.password}
      />
      {!isLogin && (
        <Input
          label="Confirm Password"
          secure
          value={confirmPassword}
          onUpdateValue={setConfirmPassword}
          isInvalid={credentialsInvalid.confirmPassword}
        />
      )}
      <PressableScale onPress={submit} style={[styles.cta, { backgroundColor: t.primary }]}>
        <Ionicons name={isLogin ? 'flash' : 'flame'} size={18} color={t.textPrimary} />
        <Text style={[Tokens.font.h3, { color: t.textPrimary, marginLeft: 10 }]}>
          {isLogin ? 'Enter the Void' : 'Inscribe Practitioner'}
        </Text>
      </PressableScale>
    </View>
  );
}

export default AuthForm;

const styles = StyleSheet.create({
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: Tokens.radius.pill,
    marginTop: Tokens.spacing.md,
  },
});
