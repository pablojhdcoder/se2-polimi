import React, { useState } from 'react';
import {
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Button, Input, Card, ErrorMessage } from '../../components';
import api from '../../services/api';
import { requestWithRetry } from '../../services/requestWithRetry';
import { setSession } from '../../storage';
import { useAuth } from '../../navigation/useAuth';
import { layoutStyles } from '../../styles';
import { STRINGS } from '../../constants/strings';
import styles from './RegisterScreen.styles';

/**
 * Register screen (UC1).
 * Uses api.js for POST /auth/register; optionally logs in and saves token/user in storage.
 * @param {Object} navigation - React Navigation object
 */
export default function RegisterScreen({ navigation }) {
  const { setToken, setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError('');
    if (!email.trim() || !password) {
      setError(STRINGS.INTRODUCE_EMAIL_PASSWORD);
      return;
    }
    if (password.length < 6) {
      setError(STRINGS.PASSWORD_MIN_6);
      return;
    }
    setLoading(true);
    try {
      await requestWithRetry(() =>
        api.post('/auth/register', {
          email: email.trim(),
          password,
          name: name.trim() || undefined,
        })
      );
      const response = await requestWithRetry(() =>
        api.post('/auth/login', {
          email: email.trim(),
          password,
        })
      );
      const { data } = response;
      const token = data.token ?? data.accessToken ?? data.access_token;
      const user = data.user ?? data;
      if (token) {
        await setSession(token, user ?? null);
        setToken(token);
        setUser(user ?? null);
      } else {
        setError(STRINGS.REGISTER_SUCCESS_LOGIN);
        navigation.navigate('Login');
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ??
        err.response?.data?.error ??
        err.message ??
        STRINGS.REGISTER_ERROR;
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={layoutStyles.screenContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.registerScreen_scroll}
        keyboardShouldPersistTaps="handled"
      >
        <Card style={layoutStyles.cardPadding}>
          <Text style={styles.registerScreen_title}>{STRINGS.REGISTER}</Text>
          <ErrorMessage message={error} />
          <Input
            label={STRINGS.NAME_OPTIONAL}
            value={name}
            onChangeText={setName}
            placeholder={STRINGS.YOUR_NAME}
            autoCapitalize="words"
          />
          <Input
            label={STRINGS.EMAIL}
            value={email}
            onChangeText={setEmail}
            placeholder={STRINGS.EMAIL_PLACEHOLDER}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            label={STRINGS.PASSWORD_MIN}
            value={password}
            onChangeText={setPassword}
            placeholder={STRINGS.PASSWORD_PLACEHOLDER}
            secureTextEntry
          />
          <Button
            title={STRINGS.REGISTER}
            onPress={handleRegister}
            loading={loading}
            style={layoutStyles.buttonSpacing}
          />
          <Button
            title={STRINGS.BACK}
            onPress={() => navigation.goBack()}
            variant="outline"
            style={layoutStyles.buttonSpacing}
          />
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
