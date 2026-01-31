/**
 * Mock for react-native-gesture-handler (used by @react-navigation/stack in tests).
 * Exports components as View pass-through so stack navigator renders.
 */
const React = require('react');
const { View } = require('react-native');

const MockGestureHandler = React.forwardRef((props, ref) =>
  React.createElement(View, { ...props, ref }, props.children)
);
const GestureHandlerRootView = (props) => React.createElement(View, props, props.children);

module.exports = {
  PanGestureHandler: MockGestureHandler,
  GestureHandlerRootView,
  State: {
    UNDETERMINED: 0,
    FAILED: 1,
    BEGAN: 2,
    CANCELLED: 3,
    ACTIVE: 4,
    END: 5,
  },
};
