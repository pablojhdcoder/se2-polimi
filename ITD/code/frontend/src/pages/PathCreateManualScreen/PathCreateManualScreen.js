import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { createPath, getWeatherAtOrigin } from '../../services/pathsApi';
import MapService from '../../services/map/MapService';
import { MapboxMap } from '../../components';
import { layoutStyles } from '../../styles';
import { STRINGS } from '../../constants/strings';
import { colors } from '../../styles';
import styles from './PathCreateManualScreen.styles';

const DIFFICULTIES = [STRINGS.EASY, STRINGS.MEDIUM, STRINGS.HARD];

/**
 * Create path manually. Form to create a new path and optionally navigate to detail or list.
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
  const [publish, setPublish] = useState(true);
  const [originWeather, setOriginWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState(null);
  const [durationMinutes, setDurationMinutes] = useState('');
  const [successBanner, setSuccessBanner] = useState(false);
  const [createdPath, setCreatedPath] = useState(null);
  const scrollRef = useRef(null);

  const handleAddWeather = useCallback(async () => {
    if (!startCoords) return;
    setWeatherError(null);
    setWeatherLoading(true);
    try {
      const data = await getWeatherAtOrigin(startCoords.lat, startCoords.lng);
      setOriginWeather(data);
    } catch (err) {
      setWeatherError(err.response?.data?.error || err.message || STRINGS.UNABLE_TO_LOAD_WEATHER);
      setOriginWeather(null);
    } finally {
      setWeatherLoading(false);
    }
  }, [startCoords]);

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
    setOriginWeather(null);
    setWeatherError(null);
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
    setOriginWeather(null);
    setWeatherError(null);
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
        setError(STRINGS.ERROR_CALCULATING_ROUTE);
      }
      if (directions?.path) {
        setRouteGeoJSON(directions.path);
      } else {
        setRouteGeoJSON(null);
      }
    } catch (e) {
      setError(
        e.message === 'NO_BIKE_ROUTE' ? STRINGS.NO_BIKE_ROUTE_FOUND : (e.message || STRINGS.ERROR_CALCULATING_ROUTE)
      );
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
    payload.publish = publish;
    const durationTrimmed = durationMinutes?.trim();
    if (durationTrimmed) {
      const mins = parseInt(durationTrimmed, 10);
      if (!Number.isNaN(mins) && mins > 0) payload.durationMinutes = mins;
    }
    if (originWeather) {
      payload.temperature = originWeather.temperature;
      payload.windSpeed = originWeather.windSpeed;
      payload.windDegree = originWeather.windDegree;
      payload.windGust = originWeather.windGust;
      payload.visibility = originWeather.visibility;
      payload.rain = originWeather.rain;
      payload.clouds = originWeather.clouds;
    }
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
      setCreatedPath(created);
      setSuccessBanner(true);
      setError(null);
      setTimeout(() => scrollRef.current?.scrollToEnd?.({ animated: true }), 100);
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
        ref={scrollRef}
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

        {startCoords ? (
          <View style={styles.pathCreateManualScreen_weatherCard}>
            <Text style={styles.pathCreateManualScreen_weatherTitle}>{STRINGS.WEATHER_AT_ORIGIN}</Text>
            <TouchableOpacity
              style={styles.pathCreateManualScreen_weatherButton}
              onPress={handleAddWeather}
              disabled={submitting || weatherLoading}
            >
              {weatherLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.pathCreateManualScreen_weatherButtonText}>{STRINGS.ADD_WEATHER_AUTOMATICALLY}</Text>
              )}
            </TouchableOpacity>
            {weatherError ? (
              <Text style={styles.pathCreateManualScreen_weatherError}>{weatherError}</Text>
            ) : originWeather ? (
              <>
                <View style={styles.pathCreateManualScreen_weatherRow}>
                  <Text style={styles.pathCreateManualScreen_weatherLabel}>{STRINGS.TEMPERATURE}</Text>
                  <Text style={styles.pathCreateManualScreen_weatherValue}>
                    {originWeather.temperature != null ? `${Math.round(originWeather.temperature)} °C` : '—'}
                  </Text>
                </View>
                <View style={styles.pathCreateManualScreen_weatherRow}>
                  <Text style={styles.pathCreateManualScreen_weatherLabel}>{STRINGS.WIND}</Text>
                  <Text style={styles.pathCreateManualScreen_weatherValue}>
                    {originWeather.windSpeed != null
                      ? `${originWeather.windSpeed} m/s${originWeather.windDegree != null ? `, ${originWeather.windDegree}°` : ''}`
                      : '—'}
                  </Text>
                </View>
                <View style={styles.pathCreateManualScreen_weatherRow}>
                  <Text style={styles.pathCreateManualScreen_weatherLabel}>{STRINGS.VISIBILITY}</Text>
                  <Text style={styles.pathCreateManualScreen_weatherValue}>
                    {originWeather.visibility != null ? `${(originWeather.visibility / 1000).toFixed(1)} km` : '—'}
                  </Text>
                </View>
                <View style={styles.pathCreateManualScreen_weatherRow}>
                  <Text style={styles.pathCreateManualScreen_weatherLabel}>{STRINGS.RAIN}</Text>
                  <Text style={styles.pathCreateManualScreen_weatherValue}>
                    {originWeather.rain != null ? `${originWeather.rain} mm` : '—'}
                  </Text>
                </View>
                <View style={styles.pathCreateManualScreen_weatherRow}>
                  <Text style={styles.pathCreateManualScreen_weatherLabel}>{STRINGS.CLOUDS}</Text>
                  <Text style={styles.pathCreateManualScreen_weatherValue}>
                    {originWeather.clouds != null ? `${originWeather.clouds}%` : '—'}
                  </Text>
                </View>
              </>
            ) : null}
          </View>
        ) : null}

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
        <TextInput
          style={styles.pathCreateManualScreen_input}
          placeholder={STRINGS.DISTANCE_PLACEHOLDER}
          placeholderTextColor={colors.textSecondary}
          value={distance}
          onChangeText={setDistance}
          keyboardType="decimal-pad"
          editable={!submitting}
        />
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

        {error ? (
          <View style={styles.pathCreateManualScreen_errorBox}>
            <Text style={styles.pathCreateManualScreen_errorText}>{error}</Text>
          </View>
        ) : null}

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

        <Text style={styles.pathCreateManualScreen_label}>{STRINGS.ROUTE_DURATION}</Text>
        <TextInput
          style={styles.pathCreateManualScreen_input}
          placeholder={STRINGS.ROUTE_DURATION_PLACEHOLDER}
          placeholderTextColor={colors.textSecondary}
          value={durationMinutes}
          onChangeText={setDurationMinutes}
          keyboardType="number-pad"
          editable={!submitting}
        />

        <View style={styles.pathCreateManualScreen_publishRow}>
          <Text style={styles.pathCreateManualScreen_publishLabel}>{STRINGS.PUBLISH_VISIBLE_TO_ALL}</Text>
          <Switch
            value={publish}
            onValueChange={setPublish}
            disabled={submitting}
          />
        </View>

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

        {successBanner ? (
          <View style={styles.pathCreateManualScreen_successBanner}>
            <Text style={styles.pathCreateManualScreen_successText}>
              {STRINGS.PATH_CREATED_MESSAGE}
            </Text>
            <View style={styles.pathCreateManualScreen_successActions}>
              <TouchableOpacity
                style={styles.pathCreateManualScreen_successButton}
                onPress={() =>
                  navigation.replace('PathDetail', {
                    pathId: createdPath?.id,
                    path: createdPath,
                  })
                }
              >
                <Text style={styles.pathCreateManualScreen_successButtonText}>
                  {STRINGS.VIEW_DETAIL}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
