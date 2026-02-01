import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { createPath } from '../../services/pathsApi';
import MapService from '../../services/map/MapService';
import { MapboxMap } from '../../components';
import { layoutStyles } from '../../styles';
import { STRINGS } from '../../constants/strings';
import { colors } from '../../styles';
import styles from './PathCreateManualScreen.styles';

const DIFFICULTIES = [STRINGS.EASY, STRINGS.MEDIUM, STRINGS.HARD];

/**
 * Create path manually (UC). Form to create a new path and optionally navigate to detail or list.
 * Uses MapService for place search, current location, and directions/distance.
 * @param {Object} navigation - React Navigation object
 */
export default function PathCreateManualScreen({ navigation }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startPoint, setStartPoint] = useState('');
  const [endPoint, setEndPoint] = useState('');
  const [startCoords, setStartCoords] = useState(null);
  const [endCoords, setEndCoords] = useState(null);
  const [distance, setDistance] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [startSuggestions, setStartSuggestions] = useState([]);
  const [endSuggestions, setEndSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeGeoJSON, setRouteGeoJSON] = useState(null);

  const fetchStartSuggestions = useCallback(async (text) => {
    if (!text || text.length < 2) {
      setStartSuggestions([]);
      return;
    }
    setSuggestionsLoading(true);
    try {
      const features = await MapService.searchPlaces(text);
      setStartSuggestions(features || []);
    } catch (e) {
      setStartSuggestions([]);
    } finally {
      setSuggestionsLoading(false);
    }
  }, []);

  const fetchEndSuggestions = useCallback(async (text) => {
    if (!text || text.length < 2) {
      setEndSuggestions([]);
      return;
    }
    setSuggestionsLoading(true);
    try {
      const features = await MapService.searchPlaces(text);
      setEndSuggestions(features || []);
    } catch (e) {
      setEndSuggestions([]);
    } finally {
      setSuggestionsLoading(false);
    }
  }, []);

  const handleSelectStartSuggestion = useCallback((feature) => {
    const placeName = feature.place_name || feature.text || '';
    setStartPoint(placeName);
    const coords = feature.geometry?.coordinates;
    setStartCoords(coords ? { lng: coords[0], lat: coords[1] } : null);
    setStartSuggestions([]);
    setRouteGeoJSON(null);
  }, []);

  const handleSelectEndSuggestion = useCallback((feature) => {
    const placeName = feature.place_name || feature.text || '';
    setEndPoint(placeName);
    const coords = feature.geometry?.coordinates;
    setEndCoords(coords ? { lng: coords[0], lat: coords[1] } : null);
    setEndSuggestions([]);
    setRouteGeoJSON(null);
  }, []);

  const handleUseMyLocationStart = useCallback(async () => {
    setLocationLoading('start');
    setError(null);
    try {
      const loc = await MapService.getCurrentLocation();
      setStartCoords({ lng: loc.longitude, lat: loc.latitude });
      const address = await MapService.reverseGeocode(loc.latitude, loc.longitude);
      setStartPoint(address || `${loc.latitude.toFixed(4)}, ${loc.longitude.toFixed(4)}`);
    } catch (e) {
      setError(e.message || 'Could not get location');
    } finally {
      setLocationLoading(null);
    }
  }, []);

  const handleUseMyLocationEnd = useCallback(async () => {
    setLocationLoading('end');
    setError(null);
    try {
      const loc = await MapService.getCurrentLocation();
      setEndCoords({ lng: loc.longitude, lat: loc.latitude });
      const address = await MapService.reverseGeocode(loc.latitude, loc.longitude);
      setEndPoint(address || `${loc.latitude.toFixed(4)}, ${loc.longitude.toFixed(4)}`);
    } catch (e) {
      setError(e.message || 'Could not get location');
    } finally {
      setLocationLoading(null);
    }
  }, []);

  const handleCalculateDistance = useCallback(async () => {
    if (!startCoords || !endCoords) {
      setError('Set both start and end points (use search or "Use my location")');
      return;
    }
    setRouteLoading(true);
    setError(null);
    try {
      const start = [startCoords.lng, startCoords.lat];
      const end = [endCoords.lng, endCoords.lat];
      const directions = await MapService.getDirections(start, end);
      if (directions?.summary?.distance != null) {
        const km = (directions.summary.distance / 1000).toFixed(2);
        setDistance(km);
      } else {
        setError('Could not calculate route');
      }
      if (directions?.path) {
        setRouteGeoJSON(directions.path);
      } else {
        setRouteGeoJSON(null);
      }
    } catch (e) {
      setError(e.message || 'Could not calculate route');
      setRouteGeoJSON(null);
    } finally {
      setRouteLoading(false);
    }
  }, [startCoords, endCoords]);

  const mapCenter = useMemo(() => {
    if (startCoords && endCoords) {
      return [
        (startCoords.lng + endCoords.lng) / 2,
        (startCoords.lat + endCoords.lat) / 2,
      ];
    }
    if (startCoords) return [startCoords.lng, startCoords.lat];
    if (endCoords) return [endCoords.lng, endCoords.lat];
    return null;
  }, [startCoords, endCoords]);

  const mapMarkers = useMemo(() => {
    const m = [];
    if (startCoords) m.push({ id: 'A', coords: [startCoords.lng, startCoords.lat], label: 'A' });
    if (endCoords) m.push({ id: 'B', coords: [endCoords.lng, endCoords.lat], label: 'B' });
    return m;
  }, [startCoords, endCoords]);

  const buildPayload = () => {
    const payload = { name: name.trim() };
    if (description.trim()) payload.description = description.trim();
    if (startPoint.trim()) payload.startPoint = startPoint.trim();
    if (endPoint.trim()) payload.endPoint = endPoint.trim();
    const dist = parseFloat(String(distance).replace(',', '.'));
    if (!Number.isNaN(dist) && dist >= 0) {
      payload.distance = dist;
      payload.length = dist;
    }
    if (difficulty.trim()) payload.difficulty = difficulty.trim();
    if (startCoords) {
      payload.startX = startCoords.lng;
      payload.startY = startCoords.lat;
    }
    if (endCoords) {
      payload.endX = endCoords.lng;
      payload.endY = endCoords.lat;
    }
    if (routeGeoJSON) payload.routeData = routeGeoJSON;
    return payload;
  };

  const handleSubmit = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError(STRINGS.ROUTE_NAME_REQUIRED);
      return;
    }
    if (!startCoords || !endCoords) {
      setError(STRINGS.START_END_POINTS_REQUIRED);
      return;
    }
    const dist = parseFloat(String(distance).replace(',', '.'));
    if (Number.isNaN(dist) || dist < 0) {
      setError(STRINGS.DISTANCE_REQUIRED);
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
      <View style={styles.pathCreateManualScreen_mapWrap}>
        <MapboxMap
          center={mapCenter}
          zoom={mapMarkers.length >= 2 ? 11 : 12}
          routeGeoJSON={routeGeoJSON}
          markers={mapMarkers}
          style={styles.pathCreateManualScreen_map}
        />
      </View>
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
        <View>
          <TextInput
            style={styles.pathCreateManualScreen_input}
            placeholder={STRINGS.ADDRESS_OR_PLACE}
            placeholderTextColor={colors.textSecondary}
            value={startPoint}
            onChangeText={(text) => {
              setStartPoint(text);
              setStartCoords(null);
              setRouteGeoJSON(null);
              fetchStartSuggestions(text);
            }}
            editable={!submitting}
          />
          {suggestionsLoading && startSuggestions.length === 0 && startPoint.length >= 2 ? (
            <ActivityIndicator size="small" style={{ marginVertical: 4 }} />
          ) : null}
          {startSuggestions.length > 0 ? (
            <View style={styles.pathCreateManualScreen_suggestions}>
              <FlatList
                data={startSuggestions.slice(0, 5)}
                keyExtractor={(item) => item.id || item.place_name || String(Math.random())}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.pathCreateManualScreen_suggestionItem}
                    onPress={() => handleSelectStartSuggestion(item)}
                  >
                    <Text style={styles.pathCreateManualScreen_suggestionText} numberOfLines={1}>
                      {item.place_name || item.text}
                    </Text>
                  </TouchableOpacity>
                )}
                scrollEnabled={false}
              />
            </View>
          ) : null}
          <TouchableOpacity
            style={styles.pathCreateManualScreen_locationButton}
            onPress={handleUseMyLocationStart}
            disabled={submitting || locationLoading === 'start'}
          >
            {locationLoading === 'start' ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Text style={styles.pathCreateManualScreen_locationButtonText}>Use my location</Text>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.pathCreateManualScreen_label}>{STRINGS.END_POINT}</Text>
        <View>
          <TextInput
            style={styles.pathCreateManualScreen_input}
            placeholder={STRINGS.ADDRESS_OR_PLACE}
            placeholderTextColor={colors.textSecondary}
            value={endPoint}
            onChangeText={(text) => {
              setEndPoint(text);
              setEndCoords(null);
              setRouteGeoJSON(null);
              fetchEndSuggestions(text);
            }}
            editable={!submitting}
          />
          {suggestionsLoading && endSuggestions.length === 0 && endPoint.length >= 2 ? (
            <ActivityIndicator size="small" style={{ marginVertical: 4 }} />
          ) : null}
          {endSuggestions.length > 0 ? (
            <View style={styles.pathCreateManualScreen_suggestions}>
              <FlatList
                data={endSuggestions.slice(0, 5)}
                keyExtractor={(item) => item.id || item.place_name || String(Math.random())}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.pathCreateManualScreen_suggestionItem}
                    onPress={() => handleSelectEndSuggestion(item)}
                  >
                    <Text style={styles.pathCreateManualScreen_suggestionText} numberOfLines={1}>
                      {item.place_name || item.text}
                    </Text>
                  </TouchableOpacity>
                )}
                scrollEnabled={false}
              />
            </View>
          ) : null}
          <TouchableOpacity
            style={styles.pathCreateManualScreen_locationButton}
            onPress={handleUseMyLocationEnd}
            disabled={submitting || locationLoading === 'end'}
          >
            {locationLoading === 'end' ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Text style={styles.pathCreateManualScreen_locationButtonText}>Use my location</Text>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.pathCreateManualScreen_label}>{STRINGS.DISTANCE_KM}</Text>
        {startCoords && endCoords ? (
          <TouchableOpacity
            style={styles.pathCreateManualScreen_calcButton}
            onPress={handleCalculateDistance}
            disabled={submitting || routeLoading}
          >
            {routeLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.pathCreateManualScreen_calcButtonText}>Calculate distance from route</Text>
            )}
          </TouchableOpacity>
        ) : null}
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
