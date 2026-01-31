import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { createPath } from '../../services/pathsApi';
import { layoutStyles } from '../../styles';
import { STRINGS } from '../../constants/strings';
import { colors } from '../../styles';
import styles from './PathCreateManualScreen.styles';

const DIFFICULTIES = [STRINGS.EASY, STRINGS.MEDIUM, STRINGS.HARD];

/**
 * Create path manually (UC). Form to create a new path and optionally navigate to detail or list.
 * @param {Object} navigation - React Navigation object
 */
export default function PathCreateManualScreen({ navigation }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startPoint, setStartPoint] = useState('');
  const [endPoint, setEndPoint] = useState('');
  const [distance, setDistance] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const buildPayload = () => {
    const payload = { name: name.trim() };
    if (description.trim()) payload.description = description.trim();
    if (startPoint.trim()) payload.startPoint = startPoint.trim();
    if (endPoint.trim()) payload.endPoint = endPoint.trim();
    const dist = parseFloat(distance.replace(',', '.'));
    if (!Number.isNaN(dist) && dist >= 0) payload.distance = dist;
    if (difficulty.trim()) payload.difficulty = difficulty.trim();
    return payload;
  };

  const handleSubmit = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError(STRINGS.ROUTE_NAME_REQUIRED);
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const body = buildPayload();
      const result = await createPath(body);
      const created = result?.path ?? result?.data ?? result;
      setSubmitting(false);
      Alert.alert(
        STRINGS.PATH_CREATED,
        STRINGS.PATH_CREATED_MESSAGE,
        [
          {
            text: STRINGS.VIEW_DETAIL,
            onPress: () =>
              navigation.replace('PathDetail', {
                pathId: created?.id,
                path: created,
              }),
          },
          {
            text: STRINGS.BACK_TO_LIST,
            onPress: () => navigation.replace('PathList'),
          },
        ]
      );
    } catch (err) {
      setSubmitting(false);
      setError(err.response?.data?.message || err.message || STRINGS.ERROR_CREATING_PATH);
    }
  };

  return (
    <KeyboardAvoidingView
      style={layoutStyles.screenContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <ScrollView
        style={styles.pathCreateManualScreen_scroll}
        contentContainerStyle={styles.pathCreateManualScreen_content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.pathCreateManualScreen_label}>{STRINGS.ROUTE_NAME_LABEL}</Text>
        <TextInput
          style={styles.pathCreateManualScreen_input}
          placeholder={STRINGS.ROUTE_NAME_PLACEHOLDER}
          placeholderTextColor={colors.textSecondary}
          value={name}
          onChangeText={setName}
          editable={!submitting}
        />

        <Text style={styles.pathCreateManualScreen_label}>{STRINGS.START_POINT}</Text>
        <TextInput
          style={styles.pathCreateManualScreen_input}
          placeholder={STRINGS.ADDRESS_OR_PLACE}
          placeholderTextColor={colors.textSecondary}
          value={startPoint}
          onChangeText={setStartPoint}
          editable={!submitting}
        />

        <Text style={styles.pathCreateManualScreen_label}>{STRINGS.END_POINT}</Text>
        <TextInput
          style={styles.pathCreateManualScreen_input}
          placeholder={STRINGS.ADDRESS_OR_PLACE}
          placeholderTextColor={colors.textSecondary}
          value={endPoint}
          onChangeText={setEndPoint}
          editable={!submitting}
        />

        <Text style={styles.pathCreateManualScreen_label}>{STRINGS.DISTANCE_KM}</Text>
        <TextInput
          style={styles.pathCreateManualScreen_input}
          placeholder={STRINGS.DISTANCE_PLACEHOLDER}
          placeholderTextColor={colors.textSecondary}
          value={distance}
          onChangeText={setDistance}
          keyboardType="decimal-pad"
          editable={!submitting}
        />

        <Text style={styles.pathCreateManualScreen_label}>{STRINGS.DIFFICULTY}</Text>
        <View style={styles.pathCreateManualScreen_difficultyRow}>
          {DIFFICULTIES.map((d) => (
            <TouchableOpacity
              key={d}
              style={[styles.pathCreateManualScreen_chip, difficulty === d && styles.pathCreateManualScreen_chipSelected]}
              onPress={() => setDifficulty(d)}
              disabled={submitting}
            >
              <Text style={[styles.pathCreateManualScreen_chipText, difficulty === d && styles.pathCreateManualScreen_chipTextSelected]}>
                {d}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.pathCreateManualScreen_label}>{STRINGS.DESCRIPTION}</Text>
        <TextInput
          style={[styles.pathCreateManualScreen_input, styles.pathCreateManualScreen_textArea]}
          placeholder={STRINGS.OPTIONAL_DESCRIPTION}
          placeholderTextColor={colors.textSecondary}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          editable={!submitting}
        />

        {error ? (
          <View style={styles.pathCreateManualScreen_errorBox}>
            <Text style={styles.pathCreateManualScreen_errorText}>{error}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={[styles.pathCreateManualScreen_submitButton, submitting && styles.pathCreateManualScreen_submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          <Text style={styles.pathCreateManualScreen_submitText}>
            {submitting ? STRINGS.CREATING : STRINGS.CREATE_PATH}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.pathCreateManualScreen_cancelButton}
          onPress={() => navigation.goBack()}
          disabled={submitting}
        >
          <Text style={styles.pathCreateManualScreen_cancelText}>{STRINGS.CANCEL}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
