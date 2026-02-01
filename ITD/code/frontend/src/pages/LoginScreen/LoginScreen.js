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
import styles from './LoginScreen.styles';

/**
 * Login screen.
 * Uses api.js for POST /auth/login; saves token and user in storage and updates AuthContext.
 * @param {Object} navigation - React Navigation object
 */
export default function LoginScreen({ navigation }) {
  const { setToken, setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    if (!email.trim() || !password) {
      setError(STRINGS.INTRODUCE_EMAIL_PASSWORD);
      return;
    }
    setLoading(true);
    try {
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
        // RootNavigator re-renders with isAuthenticated=true and shows Main stack; no need to navigate
      } else {
        setError(STRINGS.SERVER_NO_TOKEN);
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ??
        err.response?.data?.error ??
        err.message ??
        STRINGS.LOGIN_ERROR;
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
        contentContainerStyle={styles.loginScreen_scroll}
        keyboardShouldPersistTaps="handled"
      >
        <Card style={layoutStyles.cardPadding}>
          <Text style={styles.loginScreen_title}>{STRINGS.LOG_IN}</Text>
          <ErrorMessage message={error} />
          <Input
            label={STRINGS.EMAIL}
            value={email}
            onChangeText={setEmail}
            placeholder={STRINGS.EMAIL_PLACEHOLDER}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            label={STRINGS.PASSWORD}
            value={password}
            onChangeText={setPassword}
            placeholder={STRINGS.PASSWORD_PLACEHOLDER}
            secureTextEntry
          />
          <Button
            title={STRINGS.ENTER}
            onPress={handleLogin}
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
