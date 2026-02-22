/**
 * ProfileScreen - User profile and settings (DD ch03).
 * User card, options (Profile + Edit, Activity statistics), Log out button.
 * Edit shows only Personal info form (full_name, email, phone_number); rest of screen hidden.
 */

import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Button, Avatar, Input } from '../../components';
import { useAuth } from '../../navigation/useAuth';
import { getTrips } from '../../services/tripsApi';
import { getOfflineData, setSession } from '../../storage';
import { updateProfile } from '../../services/api';
import { layoutStyles } from '../../styles';
import { STRINGS } from '../../constants/strings';
import styles from './ProfileScreen.styles';

const METERS_PER_POINT_ESTIMATE = 10;

function estimateDistanceKm(trips) {
  if (!Array.isArray(trips)) return 0;
  const totalM = trips.reduce((acc, t) => acc + (t.track?.length ?? 0) * METERS_PER_POINT_ESTIMATE, 0);
  return Math.round((totalM / 1000) * 10) / 10;
}

const OPTION_ICONS = {
  profile: '⚙',
  pin: '📍',
  bell: '🔔',
  chevron: '›',
};

export default function ProfileScreen({ navigation }) {
  const { user, setUser, token, logout } = useAuth();
  const [totalDistanceKm, setTotalDistanceKm] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editFullName, setEditFullName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhoneNumber, setEditPhoneNumber] = useState('');
  const [editError, setEditError] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  const loadStats = useCallback(async () => {
    try {
      const result = await getTrips();
      const list = Array.isArray(result) ? result : result?.data ?? result?.trips ?? [];
      setTotalDistanceKm(estimateDistanceKm(list));
    } catch {
      try {
        const offline = await getOfflineData();
        const trips = offline?.trips ?? [];
        const list = Array.isArray(trips) ? trips : [];
        setTotalDistanceKm(estimateDistanceKm(list));
      } catch {
        setTotalDistanceKm(0);
      }
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const displayName = (user?.full_name ?? user?.name)?.trim() || STRINGS.USER;
  const displayEmail = user?.email || '—';

  const startEditing = useCallback(() => {
    setEditFullName((user?.full_name ?? user?.name ?? '').trim());
    setEditEmail(user?.email ?? '');
    setEditPhoneNumber(user?.phone_number ?? '');
    setEditError('');
    setIsEditing(true);
  }, [user]);

  const cancelEditing = useCallback(() => {
    setIsEditing(false);
    setEditError('');
  }, []);

  const saveProfile = useCallback(async () => {
    setEditError('');
    const fullName = editFullName.trim();
    const email = editEmail.trim();
    if (!fullName || !email) {
      setEditError(STRINGS.PROFILE_EDIT_NAME_EMAIL_REQUIRED);
      return;
    }
    setEditLoading(true);
    try {
      const data = {
        full_name: fullName,
        email,
        phone_number: editPhoneNumber.trim() || null,
      };
      const updated = await updateProfile(data);
      if (token) {
        await setSession(token, updated);
      }
      setUser(updated ?? null);
      setIsEditing(false);
    } catch (err) {
      const msg = err.response?.data?.error ?? err.response?.data?.message ?? err.message ?? STRINGS.REGISTER_ERROR;
      setEditError(msg);
    } finally {
      setEditLoading(false);
    }
  }, [editFullName, editEmail, editPhoneNumber, token, setUser]);

  return (
    <KeyboardAvoidingView
      style={layoutStyles.screenContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView
        style={layoutStyles.screenContainer}
        contentContainerStyle={styles.profileScreen_content}
        keyboardShouldPersistTaps="handled"
      >
        {!isEditing && (
          <Text style={styles.profileScreen_sectionTitle}>{STRINGS.PROFILE_AND_SETTINGS}</Text>
        )}

        {!isEditing && (
          <View style={styles.profileScreen_userCard}>
            <View style={styles.profileScreen_avatarWrap}>
              <Avatar user={user} size={72} />
            </View>
            <View style={styles.profileScreen_userInfo}>
              <Text style={styles.profileScreen_userName}>{displayName}</Text>
              <Text style={styles.profileScreen_userEmail}>{displayEmail}</Text>
            </View>
          </View>
        )}

        {isEditing && (
          <View style={styles.profileScreen_editCard}>
            <Text style={styles.profileScreen_editTitle}>{STRINGS.PERSONAL_INFO}</Text>
            <Input
              label={STRINGS.YOUR_NAME}
              value={editFullName}
              onChangeText={setEditFullName}
              placeholder={STRINGS.YOUR_NAME}
              autoCapitalize="words"
              editable={!editLoading}
              style={styles.profileScreen_editInput}
            />
            <Input
              label={STRINGS.EMAIL}
              value={editEmail}
              onChangeText={setEditEmail}
              placeholder={STRINGS.EMAIL_PLACEHOLDER}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!editLoading}
              style={styles.profileScreen_editInput}
            />
            <Input
              label={STRINGS.PHONE_NUMBER}
              value={editPhoneNumber}
              onChangeText={setEditPhoneNumber}
              placeholder={STRINGS.PHONE_NUMBER}
              keyboardType="phone-pad"
              editable={!editLoading}
              style={styles.profileScreen_editInput}
            />
            {editError ? <Text style={styles.profileScreen_editError}>{editError}</Text> : null}
            <View style={styles.profileScreen_editActions}>
              <Button
                title={STRINGS.CANCEL}
                variant="secondary"
                onPress={cancelEditing}
                style={styles.profileScreen_editActionButton}
                disabled={editLoading}
              />
              <Button
                title={STRINGS.SAVE}
                variant="primary"
                onPress={saveProfile}
                style={styles.profileScreen_editActionButton}
                disabled={editLoading}
              />
            </View>
          </View>
        )}

        {!isEditing && (
          <>
            <View style={styles.profileScreen_optionsCard}>
              <TouchableOpacity
                style={styles.profileScreen_optionRow}
                activeOpacity={0.7}
                onPress={startEditing}
              >
                <Text style={styles.profileScreen_optionIcon}>{OPTION_ICONS.profile}</Text>
                <Text style={styles.profileScreen_optionLabel}>{STRINGS.PROFILE}</Text>
                <Button
                  title={STRINGS.EDIT}
                  variant="primary"
                  onPress={startEditing}
                  style={styles.profileScreen_editButton}
                  textStyle={styles.profileScreen_editButtonText}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.profileScreen_optionRow, styles.profileScreen_optionRowLast]}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('TripStatistics')}
              >
                <Text style={styles.profileScreen_optionIcon}>{OPTION_ICONS.pin}</Text>
                <Text style={styles.profileScreen_optionLabel}>{STRINGS.ACTIVITY_STATISTICS}</Text>
                <View style={styles.profileScreen_optionRight}>
                  <Text style={styles.profileScreen_optionValue}>{totalDistanceKm} {STRINGS.KM}</Text>
                  <Text style={styles.profileScreen_chevron}>{OPTION_ICONS.chevron}</Text>
                </View>
              </TouchableOpacity>
            </View>

            <Button
              title={STRINGS.LOG_OUT}
              onPress={logout}
              variant="primary"
              style={[layoutStyles.buttonSpacing, styles.profileScreen_logOutButton]}
            />
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
