import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Animated,
  PanResponder,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapboxMap } from '../../components';
import { DEFAULT_CENTER, DEFAULT_ZOOM } from '../../components/map/constants';
import { searchPaths, getCachedPaths, requestRelatedPaths, normalizePathForDisplay } from '../../services/pathsApi';
import MapService from '../../services/map/MapService';
import { useNetworkStatus } from '../../contexts/NetworkStatusContext';
import { STRINGS } from '../../constants/strings';
import { colors } from '../../styles';
import styles from './PathSearchScreen.styles';

const SEARCH_MODE_ORIGIN = 'originDestination';
const SEARCH_MODE_KEYWORD = 'keyword';
const MAX_VISIBLE_ITEMS = 3;
const SHEET_ROW_HEIGHT = 72;
const SHEET_HANDLE_BLOCK = 16;
const SHEET_TITLE_BLOCK = 36;
const SHEET_SHOW_MORE_BUTTON_HEIGHT = 48;
const SHEET_PADDING_BOTTOM = 24;
const SHEET_MAX_HEIGHT_RATIO = 0.5;

function pathToRouteGeoJSON(path) {
  const routeData = path.route_data ?? path.routeData;
  if (routeData?.coordinates && routeData.coordinates.length >= 2) {
    return { type: 'LineString', coordinates: routeData.coordinates };
  }
  const startX = path.start_x ?? path.startX;
  const startY = path.start_y ?? path.startY;
  const endX = path.end_x ?? path.endX;
  const endY = path.end_y ?? path.endY;
  if (startX != null && startY != null && endX != null && endY != null) {
    return {
      type: 'LineString',
      coordinates: [[startX, startY], [endX, endY]],
    };
  }
  return null;
}

function pathsToBounds(paths) {
  let minLat = Infinity, maxLat = -Infinity, minLng = Infinity, maxLng = -Infinity;
  let hasAny = false;
  for (const path of paths) {
    const geo = pathToRouteGeoJSON(path);
    if (geo?.coordinates) {
      for (const [lng, lat] of geo.coordinates) {
        minLat = Math.min(minLat, lat);
        maxLat = Math.max(maxLat, lat);
        minLng = Math.min(minLng, lng);
        maxLng = Math.max(maxLng, lng);
        hasAny = true;
      }
    }
  }
  if (!hasAny) return null;
  const center = [(minLng + maxLng) / 2, (minLat + maxLat) / 2];
  const latSpan = maxLat - minLat;
  const lngSpan = maxLng - minLng;
  const span = Math.max(latSpan, lngSpan, 0.01);
  const zoom = Math.max(8, Math.min(16, Math.round(14 - Math.log2(span * 100))));
  return { center, zoom };
}

/**
 * Path search screen. Map in background; toggle between origin/destination and keyword search.
 * When results exist, paths are drawn on the map and a bottom sheet lists them with specification; tap to open PathDetail.
 */
export default function PathSearchScreen({ navigation }) {
  const { isOnline } = useNetworkStatus();
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();

  const [searchMode, setSearchMode] = useState(SEARCH_MODE_ORIGIN);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [query, setQuery] = useState('');
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(null);
  const [isCached, setIsCached] = useState(false);
  const [placeSuggestions, setPlaceSuggestions] = useState([]);
  const [suggestionTarget, setSuggestionTarget] = useState(null);
  const [searchByPlaceNext, setSearchByPlaceNext] = useState(false);
  const [placeSuggestionsLoading, setPlaceSuggestionsLoading] = useState(false);
  const [locationLoadingTarget, setLocationLoadingTarget] = useState(null);
  const [displayedCount, setDisplayedCount] = useState(3);
  const [sheetCollapsed, setSheetCollapsed] = useState(false);
  const sheetTranslateY = useRef(new Animated.Value(windowHeight)).current;
  const restTranslateYRef = useRef(windowHeight);

  const displayedPaths = useMemo(
    () => paths.slice(0, displayedCount),
    [paths, displayedCount]
  );

  const sheetHeight = useMemo(() => {
    const base = SHEET_HANDLE_BLOCK + SHEET_TITLE_BLOCK + SHEET_PADDING_BOTTOM;
    if (loading || (searched && paths.length === 0)) {
      return Math.max(120, base + 24);
    }
    const count = displayedPaths.length;
    const contentHeight = count * SHEET_ROW_HEIGHT + (paths.length > displayedCount ? SHEET_SHOW_MORE_BUTTON_HEIGHT : 0);
    const total = base + contentHeight;
    const maxHeight = Math.floor(windowHeight * SHEET_MAX_HEIGHT_RATIO);
    return Math.min(total, maxHeight);
  }, [loading, searched, paths.length, displayedCount, displayedPaths.length, windowHeight]);

  const fetchPlaceSuggestions = useCallback(async (text, target) => {
    if (!text || text.length < 2) {
      setPlaceSuggestions([]);
      setSuggestionTarget(null);
      return;
    }
    setSuggestionTarget(target);
    setPlaceSuggestionsLoading(true);
    try {
      const features = await MapService.searchPlaces(text);
      setPlaceSuggestions(features || []);
    } catch (e) {
      setPlaceSuggestions([]);
    } finally {
      setPlaceSuggestionsLoading(false);
    }
  }, []);

  const handleUseCurrentLocation = useCallback(async (target) => {
    setLocationLoadingTarget(target);
    setError(null);
    try {
      const loc = await MapService.getCurrentLocation();
      const address = await MapService.reverseGeocode(loc.latitude, loc.longitude);
      const value = address || 'My location';
      if (target === 'origin') setOrigin(value);
      else if (target === 'destination') setDestination(value);
      else setQuery(value);
      setPlaceSuggestions([]);
      setSuggestionTarget(null);
    } catch (e) {
      setError(e.message || 'Could not get location');
    } finally {
      setLocationLoadingTarget(null);
    }
  }, []);

  const doSearchByRoute = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSearched(true);
    setDisplayedCount(3);
    setIsCached(false);
    try {
      if (!isOnline) {
        const cached = await getCachedPaths();
        const list = Array.isArray(cached) ? cached : [];
        setPaths(list.map(normalizePathForDisplay).filter(Boolean));
        setIsCached(true);
      } else {
        const result = await requestRelatedPaths(origin.trim() || '', destination.trim() || '');
        const raw = Array.isArray(result) ? result : (result?.data ?? result?.paths ?? []);
        setPaths(raw.map(normalizePathForDisplay).filter(Boolean));
      }
    } catch (err) {
      if (!isOnline) {
        const cached = await getCachedPaths();
        const list = Array.isArray(cached) ? cached : [];
        setPaths(list.map(normalizePathForDisplay).filter(Boolean));
        setIsCached(list.length > 0);
      } else {
        setError(err.message || STRINGS.ERROR_SEARCH);
        setPaths([]);
      }
    } finally {
      setLoading(false);
    }
  }, [origin, destination, isOnline]);

  const doSearch = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSearched(true);
    setDisplayedCount(3);
    setIsCached(false);
    try {
      if (!isOnline) {
        const cached = await getCachedPaths();
        const list = Array.isArray(cached) ? cached : [];
        setPaths(list.map(normalizePathForDisplay).filter(Boolean));
        setIsCached(true);
      } else {
        const result = await searchPaths({
          search: query.trim() || undefined,
          searchBy: searchByPlaceNext ? 'place' : undefined
        });
        const raw = Array.isArray(result) ? result : (result?.data ?? result?.paths ?? []);
        setPaths(raw.map(normalizePathForDisplay).filter(Boolean));
      }
      setSearchByPlaceNext(false);
    } catch (err) {
      if (!isOnline) {
        const cached = await getCachedPaths();
        const list = Array.isArray(cached) ? cached : [];
        setPaths(list.map(normalizePathForDisplay).filter(Boolean));
        setIsCached(list.length > 0);
      } else {
        setError(err.message || STRINGS.ERROR_SEARCH);
        setPaths([]);
      }
      setSearchByPlaceNext(false);
    } finally {
      setLoading(false);
    }
  }, [query, isOnline, searchByPlaceNext]);

  const handlePathPress = useCallback(
    (path) => {
      navigation.navigate('PathDetail', { pathId: path.id, path });
    },
    [navigation]
  );

  const handleSelectSuggestion = useCallback((feature) => {
    const placeName = feature.place_name || feature.text || '';
    if (suggestionTarget === 'origin') setOrigin(placeName);
    else if (suggestionTarget === 'destination') setDestination(placeName);
    else {
      setQuery(placeName);
      setSearchByPlaceNext(true);
    }
    setPlaceSuggestions([]);
    setSuggestionTarget(null);
  }, [suggestionTarget]);

  const routes = useMemo(() => {
    return displayedPaths.map(pathToRouteGeoJSON).filter(Boolean);
  }, [displayedPaths]);

  const markers = useMemo(() => {
    const out = [];
    displayedPaths.forEach((path) => {
      const geo = pathToRouteGeoJSON(path);
      if (!geo?.coordinates || geo.coordinates.length < 2) return;
      const coords = geo.coordinates;
      out.push({ id: `path-${path.id}-start`, coords: coords[0], label: 'A' });
      out.push({ id: `path-${path.id}-end`, coords: coords[coords.length - 1], label: 'B' });
    });
    return out;
  }, [displayedPaths]);

  const mapCenterZoom = useMemo(() => {
    const bounds = pathsToBounds(displayedPaths);
    if (bounds) return { center: bounds.center, zoom: bounds.zoom };
    return { center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM };
  }, [displayedPaths]);

  const showSheet = searched;
  const showSearchOverlay = !searched || (searched && paths.length === 0 && !loading);

  useEffect(() => {
    if (showSheet) {
      restTranslateYRef.current = 0;
      setSheetCollapsed(false);
      Animated.timing(sheetTranslateY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(sheetTranslateY, {
        toValue: sheetHeight,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [showSheet, sheetHeight, sheetTranslateY]);

  const openSheet = useCallback(() => {
    restTranslateYRef.current = 0;
    setSheetCollapsed(false);
    Animated.spring(sheetTranslateY, {
      toValue: 0,
      useNativeDriver: true,
      friction: 8,
      tension: 80,
    }).start();
  }, [sheetTranslateY]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 4,
        onPanResponderGrant: () => {},
        onPanResponderMove: (_, gestureState) => {
          const rest = restTranslateYRef.current;
          const newY = Math.max(0, Math.min(sheetHeight, rest + gestureState.dy));
          sheetTranslateY.setValue(newY);
        },
        onPanResponderRelease: (_, gestureState) => {
          const rest = restTranslateYRef.current;
          const currentY = rest + gestureState.dy;
          const velocityY = gestureState.vy ?? 0;
          const shouldClose = velocityY > 0.3 || currentY > sheetHeight * 0.4;
          if (shouldClose) {
            restTranslateYRef.current = sheetHeight;
            setSheetCollapsed(true);
            Animated.spring(sheetTranslateY, {
              toValue: sheetHeight,
              useNativeDriver: true,
              friction: 8,
              tension: 80,
            }).start();
          } else {
            restTranslateYRef.current = 0;
            setSheetCollapsed(false);
            Animated.spring(sheetTranslateY, {
              toValue: 0,
              useNativeDriver: true,
              friction: 8,
              tension: 80,
            }).start();
          }
        },
      }),
    [sheetHeight, sheetTranslateY]
  );

  return (
    <View style={StyleSheet.absoluteFill}>
      <MapboxMap
        style={StyleSheet.absoluteFillObject}
        showUserLocation
        center={mapCenterZoom.center}
        zoom={mapCenterZoom.zoom}
        routes={routes}
        markers={markers}
      />

      {showSearchOverlay ? (
      <KeyboardAvoidingView
        style={[styles.pathSearchScreen_overlay, { paddingTop: insets.top + 8 }]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <View style={styles.pathSearchScreen_toggleRow}>
          <TouchableOpacity
            style={[
              styles.pathSearchScreen_toggleButton,
              searchMode === SEARCH_MODE_ORIGIN && styles.pathSearchScreen_toggleButtonActive,
            ]}
            onPress={() => setSearchMode(SEARCH_MODE_ORIGIN)}
          >
            <Text
              style={[
                styles.pathSearchScreen_toggleButtonText,
                searchMode === SEARCH_MODE_ORIGIN && styles.pathSearchScreen_toggleButtonTextActive,
              ]}
            >
              {STRINGS.SEARCH_MODE_ORIGIN_DESTINATION}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.pathSearchScreen_toggleButton,
              searchMode === SEARCH_MODE_KEYWORD && styles.pathSearchScreen_toggleButtonActive,
            ]}
            onPress={() => setSearchMode(SEARCH_MODE_KEYWORD)}
          >
            <Text
              style={[
                styles.pathSearchScreen_toggleButtonText,
                searchMode === SEARCH_MODE_KEYWORD && styles.pathSearchScreen_toggleButtonTextActive,
              ]}
            >
              {STRINGS.SEARCH_MODE_KEYWORD}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={{ maxHeight: Math.min(460, Math.floor(windowHeight * 0.55)) }}
          contentContainerStyle={styles.pathSearchScreen_scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {searchMode === SEARCH_MODE_ORIGIN ? (
            <View style={styles.pathSearchScreen_section}>
              <Text style={[styles.pathSearchScreen_sectionLabel, styles.pathSearchScreen_sectionLabelFirst]}>{STRINGS.ORIGIN}</Text>
              <TextInput
                style={styles.pathSearchScreen_input}
                placeholder={STRINGS.ORIGIN_PLACEHOLDER}
                placeholderTextColor={colors.textSecondary}
                value={origin}
                onChangeText={(text) => { setOrigin(text); fetchPlaceSuggestions(text, 'origin'); }}
              />
              {suggestionTarget === 'origin' && placeSuggestions.length > 0 ? (
                <View style={styles.pathSearchScreen_suggestions}>
                  <FlatList
                    data={placeSuggestions.slice(0, 5)}
                    keyExtractor={(item) => item.id || item.place_name || String(Math.random())}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.pathSearchScreen_suggestionItem}
                        onPress={() => handleSelectSuggestion(item)}
                      >
                        <Text style={styles.pathSearchScreen_suggestionText} numberOfLines={1}>
                          {item.place_name || item.text}
                        </Text>
                      </TouchableOpacity>
                    )}
                    scrollEnabled={false}
                  />
                </View>
              ) : suggestionTarget === 'origin' && placeSuggestionsLoading && origin.length >= 2 ? (
                <ActivityIndicator size="small" style={styles.pathSearchScreen_suggestionsLoader} />
              ) : null}
              <TouchableOpacity
                style={styles.pathSearchScreen_locationButton}
                onPress={() => handleUseCurrentLocation('origin')}
                disabled={locationLoadingTarget !== null}
              >
                {locationLoadingTarget === 'origin' ? (
                  <ActivityIndicator size="small" color={colors.primary} />
                ) : (
                  <Text style={styles.pathSearchScreen_locationButtonText}>Use my location</Text>
                )}
              </TouchableOpacity>
              <Text style={styles.pathSearchScreen_sectionLabel}>{STRINGS.DESTINATION}</Text>
              <TextInput
                style={styles.pathSearchScreen_input}
                placeholder={STRINGS.DESTINATION_PLACEHOLDER}
                placeholderTextColor={colors.textSecondary}
                value={destination}
                onChangeText={(text) => { setDestination(text); fetchPlaceSuggestions(text, 'destination'); }}
              />
              {suggestionTarget === 'destination' && placeSuggestions.length > 0 ? (
                <View style={styles.pathSearchScreen_suggestions}>
                  <FlatList
                    data={placeSuggestions.slice(0, 5)}
                    keyExtractor={(item) => item.id || item.place_name || String(Math.random())}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.pathSearchScreen_suggestionItem}
                        onPress={() => handleSelectSuggestion(item)}
                      >
                        <Text style={styles.pathSearchScreen_suggestionText} numberOfLines={1}>
                          {item.place_name || item.text}
                        </Text>
                      </TouchableOpacity>
                    )}
                    scrollEnabled={false}
                  />
                </View>
              ) : suggestionTarget === 'destination' && placeSuggestionsLoading && destination.length >= 2 ? (
                <ActivityIndicator size="small" style={styles.pathSearchScreen_suggestionsLoader} />
              ) : null}
              <TouchableOpacity
                style={styles.pathSearchScreen_locationButton}
                onPress={() => handleUseCurrentLocation('destination')}
                disabled={locationLoadingTarget !== null}
              >
                {locationLoadingTarget === 'destination' ? (
                  <ActivityIndicator size="small" color={colors.primary} />
                ) : (
                  <Text style={styles.pathSearchScreen_locationButtonText}>Use my location</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity style={styles.pathSearchScreen_primaryButton} onPress={doSearchByRoute} disabled={loading}>
                {loading ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <Text style={styles.pathSearchScreen_primaryButtonText}>{STRINGS.FIND_PATHS}</Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.pathSearchScreen_section}>
              <Text style={[styles.pathSearchScreen_sectionLabel, styles.pathSearchScreen_sectionLabelFirst]}>{STRINGS.SEARCH_BY_KEYWORD}</Text>
              <TextInput
                style={styles.pathSearchScreen_input}
                placeholder={STRINGS.SEARCH_PLACEHOLDER}
                placeholderTextColor={colors.textSecondary}
                value={query}
                onChangeText={(text) => { setQuery(text); setSearchByPlaceNext(false); fetchPlaceSuggestions(text, 'keyword'); }}
                onSubmitEditing={doSearch}
                returnKeyType="search"
              />
              {suggestionTarget === 'keyword' && placeSuggestions.length > 0 ? (
                <View style={styles.pathSearchScreen_suggestions}>
                  <FlatList
                    data={placeSuggestions.slice(0, 5)}
                    keyExtractor={(item) => item.id || item.place_name || String(Math.random())}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.pathSearchScreen_suggestionItem}
                        onPress={() => handleSelectSuggestion(item)}
                      >
                        <Text style={styles.pathSearchScreen_suggestionText} numberOfLines={1}>
                          {item.place_name || item.text}
                        </Text>
                      </TouchableOpacity>
                    )}
                    scrollEnabled={false}
                  />
                </View>
              ) : suggestionTarget === 'keyword' && placeSuggestionsLoading && query.length >= 2 ? (
                <ActivityIndicator size="small" style={styles.pathSearchScreen_suggestionsLoader} />
              ) : null}
              <TouchableOpacity
                style={styles.pathSearchScreen_locationButton}
                onPress={() => handleUseCurrentLocation('keyword')}
                disabled={locationLoadingTarget !== null}
              >
                {locationLoadingTarget === 'keyword' ? (
                  <ActivityIndicator size="small" color={colors.primary} />
                ) : (
                  <Text style={styles.pathSearchScreen_locationButtonText}>Use my location</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity style={styles.pathSearchScreen_primaryButton} onPress={doSearch} disabled={loading}>
                {loading ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <Text style={styles.pathSearchScreen_primaryButtonText}>{STRINGS.FIND_PATHS}</Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          {isCached ? (
            <View style={styles.pathSearchScreen_cachedBox}>
              <Text style={styles.pathSearchScreen_cachedText}>{STRINGS.SHOWING_CACHED_PATHS}</Text>
            </View>
          ) : null}
          {error ? (
            <View style={styles.pathSearchScreen_errorBox}>
              <Text style={styles.pathSearchScreen_errorText}>{error}</Text>
            </View>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
      ) : (
        <TouchableOpacity
          style={[styles.pathSearchScreen_newSearchButton, { top: insets.top + 8 }]}
          onPress={() => setSearched(false)}
          activeOpacity={0.8}
        >
          <Text style={styles.pathSearchScreen_newSearchButtonText}>{STRINGS.NEW_SEARCH}</Text>
        </TouchableOpacity>
      )}

      {showSheet && sheetCollapsed ? (
        <TouchableOpacity
          style={[styles.pathSearchScreen_resultsPill, { bottom: insets.bottom + 16 }]}
          onPress={openSheet}
          activeOpacity={0.8}
        >
          <Text style={styles.pathSearchScreen_resultsPillText}>{STRINGS.RESULTS}</Text>
        </TouchableOpacity>
      ) : null}

      <Animated.View
        style={[
          styles.pathSearchScreen_bottomSheet,
          {
            height: sheetHeight,
            transform: [{ translateY: sheetTranslateY }],
          },
        ]}
        pointerEvents={showSheet ? 'auto' : 'none'}
      >
        <View style={styles.pathSearchScreen_sheetHandle} {...panResponder.panHandlers} />
        <View style={[styles.pathSearchScreen_sheetContent, { flex: 1 }]}>
          {loading ? (
            <Text style={styles.pathSearchScreen_sheetTitle}>{STRINGS.LOADING_PATHS}</Text>
          ) : paths.length === 0 && searched ? (
            <Text style={styles.pathSearchScreen_sheetTitle}>{STRINGS.NO_PATHS_FOUND}</Text>
          ) : paths.length > 0 ? (
            <>
              <Text style={styles.pathSearchScreen_sheetTitle}>
                {paths.length} {paths.length === 1 ? 'path' : 'paths'} found
              </Text>
              <FlatList
                data={displayedPaths}
                keyExtractor={(item) => String(item.id)}
                style={styles.pathSearchScreen_sheetListExpanded}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.pathSearchScreen_sheetItem}
                    onPress={() => handlePathPress(item)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.pathSearchScreen_sheetItemTitle} numberOfLines={1}>
                      {item.name || STRINGS.NO_NAME}
                    </Text>
                    <Text style={styles.pathSearchScreen_sheetItemMeta}>
                      {item.distance != null ? `${item.distance} km` : ''}
                      {item.difficulty ? ` • ${item.difficulty}` : ''}
                    </Text>
                    {(item.startPoint || item.endPoint) ? (
                      <Text style={styles.pathSearchScreen_sheetItemPoints} numberOfLines={1}>
                        {item.startPoint || '?'} → {item.endPoint || '?'}
                      </Text>
                    ) : null}
                  </TouchableOpacity>
                )}
                contentContainerStyle={{ paddingBottom: SHEET_PADDING_BOTTOM }}
                ListFooterComponent={
                  paths.length > displayedCount ? (
                    <TouchableOpacity
                      style={styles.pathSearchScreen_showMoreButton}
                      onPress={() => setDisplayedCount((prev) => Math.min(prev + 3, paths.length))}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.pathSearchScreen_showMoreButtonText}>{STRINGS.LOAD_MORE_PATHS}</Text>
                    </TouchableOpacity>
                  ) : null
                }
              />
            </>
          ) : (
            <Text style={styles.pathSearchScreen_sheetTitle}>{STRINGS.TYPE_AND_SEARCH}</Text>
          )}
        </View>
      </Animated.View>
    </View>
  );
}
