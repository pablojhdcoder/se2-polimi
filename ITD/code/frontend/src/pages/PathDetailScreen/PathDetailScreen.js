import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getPathById, getCachedPathById, updatePath, normalizePathForDisplay } from '../../services/pathsApi';
import { getReviewsByPathId } from '../../services/reviewsApi';
import MapService from '../../services/map/MapService';
import { useNetworkStatus } from '../../contexts/NetworkStatusContext';
import { useAuth } from '../../navigation/useAuth';
import { MapboxMap, Button } from '../../components';
import { layoutStyles } from '../../styles';
import { STRINGS } from '../../constants/strings';
import styles from './PathDetailScreen.styles';

const STATUS_LABELS = {
  optimal: STRINGS.STATUS_OPTIMAL,
  under_maintenance: STRINGS.STATUS_UNDER_MAINTENANCE,
  path_closed: STRINGS.STATUS_PATH_CLOSED,
  requires_maintenance: STRINGS.STATUS_REQUIRES_MAINTENANCE,
  unsafe: STRINGS.STATUS_UNSAFE,
};

function getStatusLabel(status) {
  return status ? (STATUS_LABELS[status] || status) : null;
}

/** Returns true if the string looks like "lng, lat" coordinates. */
function isCoordLike(s) {
  if (typeof s !== 'string' || !s.trim()) return false;
  return /^-?\d+\.?\d*,\s*-?\d+\.?\d*$/.test(s.trim());
}

function hasWeatherData(p) {
  return p && (p.temperature != null || p.wind_speed != null || p.visibility != null || p.rain != null || p.clouds != null);
}

/**
 * Unified path detail screen. Shows place names (reverse-geocoded when needed), map with path,
 * inline reviews, and owner-only Publish/Unpublish.
 */
export default function PathDetailScreen({ route, navigation }) {
  const { isOnline } = useNetworkStatus();
  const { user } = useAuth();
  const { pathId, path: initialPath } = route.params || {};
  const [path, setPath] = useState(initialPath || null);
  const [loading, setLoading] = useState(!initialPath);
  const [error, setError] = useState(null);
  const [isCached, setIsCached] = useState(false);
  const [publishActionLoading, setPublishActionLoading] = useState(false);
  const [startPlaceName, setStartPlaceName] = useState(null);
  const [endPlaceName, setEndPlaceName] = useState(null);
  const [placeNamesLoading, setPlaceNamesLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState(null);

  const loadPath = useCallback(async () => {
    if (!pathId) {
      setPath(initialPath);
      setLoading(false);
      return;
    }
    try {
      setError(null);
      setIsCached(false);
      if (!isOnline) {
        const cached = await getCachedPathById(pathId);
        if (cached) {
          const raw = typeof cached === 'object' && cached.path ? cached.path : cached;
          setPath(normalizePathForDisplay(raw) || raw);
          setIsCached(true);
        } else {
          setError(STRINGS.ERROR_LOADING_PATH);
          if (initialPath) setPath(normalizePathForDisplay(initialPath) || initialPath);
        }
      } else {
        const data = await getPathById(pathId);
        const raw = typeof data === 'object' && data.path ? data.path : data;
        setPath(normalizePathForDisplay(raw) || raw);
      }
    } catch (err) {
      setError(err.message || STRINGS.ERROR_LOADING_PATH);
      if (initialPath) setPath(normalizePathForDisplay(initialPath) || initialPath);
    } finally {
      setLoading(false);
    }
  }, [pathId, initialPath, isOnline]);

  useEffect(() => {
    if (pathId != null || initialPath) loadPath();
    else setLoading(false);
  }, [pathId, initialPath, loadPath]);

  // Reverse-geocode start/end when we only have coordinates.
  useEffect(() => {
    const p = path;
    if (!p || placeNamesLoading) return;
    const hasStartCoords = p.start_x != null && p.start_y != null;
    const hasEndCoords = p.end_x != null && p.end_y != null;
    const startText = p.startPoint ?? '';
    const endText = p.endPoint ?? '';
    const needStart = hasStartCoords && (!startText || isCoordLike(startText));
    const needEnd = hasEndCoords && (!endText || isCoordLike(endText));
    if (!needStart && !needEnd) return;

    let cancelled = false;
    setPlaceNamesLoading(true);
    (async () => {
      try {
        if (needStart) {
          const name = await MapService.reverseGeocode(p.start_y, p.start_x);
          if (!cancelled && name) setStartPlaceName(name);
        }
        if (needEnd) {
          const name = await MapService.reverseGeocode(p.end_y, p.end_x);
          if (!cancelled && name) setEndPlaceName(name);
        }
      } catch {
        // keep place names null; we will show coords
      } finally {
        if (!cancelled) setPlaceNamesLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [path]);

  // Load reviews when path is available.
  useEffect(() => {
    const id = pathId || path?.id;
    if (!id) return;
    let cancelled = false;
    setReviewsLoading(true);
    setReviewsError(null);
    getReviewsByPathId(id)
      .then((data) => {
        if (cancelled) return;
        const list = Array.isArray(data) ? data : data?.data ?? data?.reviews ?? [];
        setReviews(list);
      })
      .catch((err) => {
        if (!cancelled) {
          setReviewsError(err?.message || STRINGS.ERROR_LOADING_REVIEWS);
          setReviews([]);
        }
      })
      .finally(() => {
        if (!cancelled) setReviewsLoading(false);
      });
    return () => { cancelled = true; };
  }, [pathId, path?.id]);

  const handlePublishToggle = useCallback(async () => {
    const id = pathId || path?.id;
    if (!id || publishActionLoading) return;
    const nextPublished = !path?.is_published;
    setPublishActionLoading(true);
    try {
      const updated = await updatePath(id, { publish: nextPublished });
      setPath((prev) => (prev ? { ...prev, ...updated, is_published: updated.is_published } : updated));
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || STRINGS.ERROR_LOADING_PATH);
    } finally {
      setPublishActionLoading(false);
    }
  }, [pathId, path?.id, path?.is_published, publishActionLoading]);

  if (!pathId && !initialPath) {
    return (
      <View style={styles.pathDetailScreen_centered}>
        <Text style={styles.pathDetailScreen_message}>{STRINGS.PATH_NOT_SPECIFIED}</Text>
      </View>
    );
  }

  if (loading && !path) {
    return (
      <View style={styles.pathDetailScreen_centered}>
        <Text style={styles.pathDetailScreen_message}>{STRINGS.LOADING_PATH}</Text>
      </View>
    );
  }

  if (error && !path) {
    return (
      <View style={styles.pathDetailScreen_centered}>
        <Text style={styles.pathDetailScreen_errorText}>{error}</Text>
        <TouchableOpacity style={styles.pathDetailScreen_retryButton} onPress={() => { setLoading(true); loadPath(); }}>
          <Text style={styles.pathDetailScreen_retryText}>{STRINGS.RETRY}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const p = path || {};
  const name = p.name ?? p.path_name ?? STRINGS.NO_NAME;
  const startPointRaw = p.startPoint ?? (p.start_x != null && p.start_y != null ? `${p.start_x}, ${p.start_y}` : null);
  const endPointRaw = p.endPoint ?? (p.end_x != null && p.end_y != null ? `${p.end_x}, ${p.end_y}` : null);
  const startDisplay = startPlaceName ?? (isCoordLike(startPointRaw) ? null : startPointRaw) ?? startPointRaw ?? '—';
  const endDisplay = endPlaceName ?? (isCoordLike(endPointRaw) ? null : endPointRaw) ?? endPointRaw ?? '—';
  const distance = p.distance ?? p.length;
  const isOwner = user?.username && (p.posted_by_username || p.postedByUsername) === user.username;
  const isPublished = p.is_published !== false;
  const statusLabel = getStatusLabel(p.status);
  const routeDataPoints = useMemo(() => {
    const rd = p.route_data;
    if (!rd) return 0;
    if (rd.coordinates && Array.isArray(rd.coordinates)) return rd.coordinates.length;
    if (rd.type === 'LineString' && rd.coordinates) return rd.coordinates.length;
    return 0;
  }, [p.route_data]);

  const routeGeoJSON = useMemo(() => {
    const rd = p.route_data;
    if (rd?.type === 'LineString' && Array.isArray(rd?.coordinates) && rd.coordinates.length >= 2) {
      return rd;
    }
    if (p.start_x != null && p.start_y != null && p.end_x != null && p.end_y != null) {
      return { type: 'LineString', coordinates: [[p.start_x, p.start_y], [p.end_x, p.end_y]] };
    }
    return null;
  }, [p.route_data, p.start_x, p.start_y, p.end_x, p.end_y]);

  const mapMarkers = useMemo(() => {
    const m = [];
    if (p.start_x != null && p.start_y != null) m.push({ id: 'A', coords: [p.start_x, p.start_y], label: 'A' });
    if (p.end_x != null && p.end_y != null) m.push({ id: 'B', coords: [p.end_x, p.end_y], label: 'B' });
    return m;
  }, [p.start_x, p.start_y, p.end_x, p.end_y]);

  const mapCenter = useMemo(() => {
    if (p.start_x != null && p.start_y != null && p.end_x != null && p.end_y != null) {
      return [(p.start_x + p.end_x) / 2, (p.start_y + p.end_y) / 2];
    }
    if (routeGeoJSON?.coordinates?.length) {
      const c = routeGeoJSON.coordinates[0];
      return Array.isArray(c) ? c : null;
    }
    if (mapMarkers.length) {
      const first = mapMarkers[0].coords;
      return Array.isArray(first) ? first : [first.lng, first.lat];
    }
    return null;
  }, [p.start_x, p.start_y, p.end_x, p.end_y, routeGeoJSON, mapMarkers]);

  const hasMap = mapMarkers.length > 0 || routeGeoJSON;
  const postedBy = p.posted_by_username || p.postedByUsername || null;

  return (
    <ScrollView style={layoutStyles.screenContainer} contentContainerStyle={styles.pathDetailScreen_content}>
      {isCached ? (
        <View style={styles.pathDetailScreen_cachedBanner}>
          <Text style={styles.pathDetailScreen_cachedText}>{STRINGS.SHOWING_CACHED_PATH}</Text>
        </View>
      ) : null}
      {error ? (
        <View style={styles.pathDetailScreen_errorBanner}>
          <Text style={styles.pathDetailScreen_errorText}>{error}</Text>
        </View>
      ) : null}

      <View style={styles.pathDetailScreen_header}>
        <Text style={styles.pathDetailScreen_title} numberOfLines={2}>{name}</Text>
        <View style={styles.pathDetailScreen_byline}>
          {postedBy ? (
            <Text style={styles.pathDetailScreen_bylineText}>
              {STRINGS.ADDED_BY} <Text style={styles.pathDetailScreen_bylineUser}>{postedBy}</Text>
            </Text>
          ) : null}
          <View style={styles.pathDetailScreen_badges}>
            <View style={[styles.pathDetailScreen_badge, isPublished ? styles.pathDetailScreen_badgePublished : styles.pathDetailScreen_badgeDraft]}>
              <Text style={isPublished ? styles.pathDetailScreen_badgeText : styles.pathDetailScreen_badgeTextDraft}>{isPublished ? STRINGS.PUBLISHED : STRINGS.DRAFT}</Text>
            </View>
            {statusLabel ? (
              <View style={styles.pathDetailScreen_badgeNeutral}>
                <Text style={styles.pathDetailScreen_badgeTextNeutral}>{statusLabel}</Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>

      {hasMap ? (
        <View style={styles.pathDetailScreen_mapWrap}>
          <MapboxMap
            center={mapCenter}
            zoom={13}
            routeGeoJSON={routeGeoJSON}
            markers={mapMarkers}
            showZoomControls={false}
            style={styles.pathDetailScreen_map}
          />
        </View>
      ) : null}

      {(startDisplay !== '—' || endDisplay !== '—') ? (
        <View style={styles.pathDetailScreen_card}>
          {placeNamesLoading ? (
            <View style={styles.pathDetailScreen_placeLoading}>
              <ActivityIndicator size="small" />
              <Text style={styles.pathDetailScreen_placeLoadingText}>{STRINGS.LOADING_PATH}</Text>
            </View>
          ) : null}
          <View style={styles.pathDetailScreen_routeRow}>
            <Text style={styles.pathDetailScreen_routeLabel}>{STRINGS.START}</Text>
            <Text style={styles.pathDetailScreen_routeValue} numberOfLines={2}>{startDisplay}</Text>
          </View>
          <View style={styles.pathDetailScreen_routeDivider} />
          <View style={styles.pathDetailScreen_routeRow}>
            <Text style={styles.pathDetailScreen_routeLabel}>{STRINGS.END}</Text>
            <Text style={styles.pathDetailScreen_routeValue} numberOfLines={2}>{endDisplay}</Text>
          </View>
        </View>
      ) : null}

      <View style={styles.pathDetailScreen_card}>
        {(distance != null || p.difficulty || p.duration_minutes != null || p.durationMinutes != null) ? (
          <View style={styles.pathDetailScreen_statsRow}>
            {distance != null ? <Text style={styles.pathDetailScreen_stat}>{distance} km</Text> : null}
            {p.difficulty ? <Text style={styles.pathDetailScreen_stat}>{p.difficulty}</Text> : null}
            {p.user_rating != null ? <Text style={styles.pathDetailScreen_stat}>{STRINGS.USER_RATING} {p.user_rating}</Text> : null}
            {routeDataPoints > 0 ? <Text style={styles.pathDetailScreen_stat}>{routeDataPoints} pts</Text> : null}
            {(p.duration_minutes != null || p.durationMinutes != null) ? (
              <Text style={styles.pathDetailScreen_stat}>
                {STRINGS.ROUTE_DURATION}: {(p.duration_minutes ?? p.durationMinutes)} min
              </Text>
            ) : null}
          </View>
        ) : null}
        {p.description ? (
          <Text style={styles.pathDetailScreen_description}>{p.description}</Text>
        ) : null}
      </View>

      {hasWeatherData(p) ? (
        <View style={styles.pathDetailScreen_card}>
          <Text style={styles.pathDetailScreen_weatherTitle}>{STRINGS.WEATHER_WHEN_RECORDED}</Text>
          <View style={styles.pathDetailScreen_routeRow}>
            <Text style={styles.pathDetailScreen_routeLabel}>{STRINGS.TEMPERATURE}</Text>
            <Text style={styles.pathDetailScreen_routeValue}>
              {p.temperature != null ? `${p.temperature} °C` : '—'}
            </Text>
          </View>
          <View style={styles.pathDetailScreen_routeDivider} />
          <View style={styles.pathDetailScreen_routeRow}>
            <Text style={styles.pathDetailScreen_routeLabel}>{STRINGS.WIND}</Text>
            <Text style={styles.pathDetailScreen_routeValue}>
              {p.wind_speed != null ? `${p.wind_speed} m/s${p.wind_degree != null ? `, ${p.wind_degree}°` : ''}` : '—'}
            </Text>
          </View>
          <View style={styles.pathDetailScreen_routeDivider} />
          <View style={styles.pathDetailScreen_routeRow}>
            <Text style={styles.pathDetailScreen_routeLabel}>{STRINGS.VISIBILITY}</Text>
            <Text style={styles.pathDetailScreen_routeValue}>
              {p.visibility != null ? `${(p.visibility / 1000).toFixed(1)} km` : '—'}
            </Text>
          </View>
          <View style={styles.pathDetailScreen_routeDivider} />
          <View style={styles.pathDetailScreen_routeRow}>
            <Text style={styles.pathDetailScreen_routeLabel}>{STRINGS.RAIN}</Text>
            <Text style={styles.pathDetailScreen_routeValue}>
              {p.rain != null ? `${p.rain} mm` : '—'}
            </Text>
          </View>
          <View style={styles.pathDetailScreen_routeDivider} />
          <View style={styles.pathDetailScreen_routeRow}>
            <Text style={styles.pathDetailScreen_routeLabel}>{STRINGS.CLOUDS}</Text>
            <Text style={styles.pathDetailScreen_routeValue}>
              {p.clouds != null ? `${p.clouds}%` : '—'}
            </Text>
          </View>
        </View>
      ) : null}

      <View style={styles.pathDetailScreen_reviewsSection}>
        <Text style={styles.pathDetailScreen_reviewsTitle}>{STRINGS.REVIEWS}</Text>
        {reviewsLoading ? (
          <Text style={styles.pathDetailScreen_reviewsLoading}>{STRINGS.LOADING_REVIEWS}</Text>
        ) : reviewsError ? (
          <Text style={styles.pathDetailScreen_reviewsError}>{reviewsError}</Text>
        ) : reviews.length === 0 ? (
          <Text style={styles.pathDetailScreen_reviewsEmpty}>{STRINGS.NO_REVIEWS_YET}</Text>
        ) : (
          reviews.map((item) => (
            <TouchableOpacity
              key={String(item.id)}
              style={styles.pathDetailScreen_reviewCard}
              onPress={() => {
                const root = navigation.getParent?.()?.getParent?.();
                if (root) root.navigate('ReviewDetail', { reviewId: item.id, review: item });
                else navigation.navigate('ReviewDetail', { reviewId: item.id, review: item });
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.pathDetailScreen_reviewMeta}>
                {item.userName ?? item.user_name ?? STRINGS.USER}
                {item.points != null || item.rating != null ? ` · ★ ${item.points ?? item.rating}` : ''}
              </Text>
              <Text style={styles.pathDetailScreen_reviewText} numberOfLines={2}>
                {item.opinion ?? item.comment ?? item.text ?? '—'}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </View>

      {isOwner ? (
        <View style={styles.pathDetailScreen_actions}>
          {isPublished ? (
            <Button
              title={STRINGS.UNPUBLISH}
              variant="outline"
              onPress={handlePublishToggle}
              disabled={publishActionLoading}
              style={styles.pathDetailScreen_actionButton}
            />
          ) : (
            <Button
              title={STRINGS.PUBLISH_PATH}
              variant="outline"
              onPress={handlePublishToggle}
              disabled={publishActionLoading}
              style={styles.pathDetailScreen_actionButton}
            />
          )}
        </View>
      ) : null}
    </ScrollView>
  );
}
