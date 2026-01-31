/**
 * Avatar generation service using DiceBear (React Native).
 * Generates deterministic SVG avatars from a seed; no Node/Sharp.
 */

let dicebearCore = null;
let dicebearCollection = null;

function ensureDicebear() {
  if (!dicebearCore) {
    try {
      dicebearCore = require('@dicebear/core');
      if (!dicebearCore || typeof dicebearCore.createAvatar !== 'function') {
        throw new Error('@dicebear/core does not have the createAvatar method');
      }
    } catch (error) {
      const msg = error?.message ?? String(error);
      console.error('Error loading @dicebear/core:', msg);
      throw new Error(`Could not load @dicebear/core: ${msg}`);
    }
  }
  if (!dicebearCollection) {
    try {
      dicebearCollection = require('@dicebear/collection');
      if (!dicebearCollection || !dicebearCollection.botttsNeutral) {
        throw new Error('@dicebear/collection does not have botttsNeutral');
      }
    } catch (error) {
      const msg = error?.message ?? String(error);
      console.error('Error loading @dicebear/collection:', msg);
      throw new Error(`Could not load @dicebear/collection: ${msg}`);
    }
  }
}

function computeDeterministicHashBase36(inputText) {
  let hashNumber = 0;
  for (let index = 0; index < inputText.length; index++) {
    const charCode = inputText.charCodeAt(index);
    hashNumber = ((hashNumber << 5) - hashNumber) + charCode;
    hashNumber |= 0;
  }
  return Math.abs(hashNumber).toString(36);
}

const AVATAR_BACKGROUND_COLORS = [
  '00897b', '00acc1', '039be5', '1e88e5', '3949ab', '43a047', '546e7a',
  '5e35b1', '6d4c41', '757575', '7cb342', '8e24aa', 'c0ca33', 'd81b60',
  'e53935', 'f4511e', 'fb8c00', 'fdd835', 'ffb300', 'ffdfbf', 'ffd5dc',
  'c0aede', 'b6e3f4', 'd1d4f9'
];

function generateUserAvatar(seed) {
  const cleanSeed = seed || Math.random().toString(36).substring(2, 11);
  ensureDicebear();
  const avatar = dicebearCore.createAvatar(dicebearCollection.botttsNeutral, {
    seed: cleanSeed,
    radius: 50,
    backgroundColor: AVATAR_BACKGROUND_COLORS,
    backgroundType: ['gradientLinear'],
    randomizeIds: true
  });
  return avatar.toString();
}

function createUserSeed(userId, email, fullName) {
  const userIdStr = userId != null ? String(userId) : '';
  const combinedString = `${userIdStr}${email || ''}${fullName || ''}`;
  if (combinedString.length > 0) {
    const cleanString = combinedString
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 20);
    if (cleanString.length < 8) {
      const hash = computeDeterministicHashBase36(combinedString);
      return (cleanString + hash).substring(0, 15);
    }
    return cleanString;
  }
  return Math.random().toString(36).substring(2, 14);
}

function getInitials(fullName, email) {
  if (fullName?.trim()) {
    const names = fullName.trim().split(/\s+/);
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    if (names.length === 1) {
      return names[0][0].toUpperCase();
    }
  }
  if (email?.trim()) {
    return email.trim()[0].toUpperCase();
  }
  return '?';
}

export {
  generateUserAvatar,
  createUserSeed,
  getInitials
};
