import React from 'react';
import { Text } from 'react-native';
import { render, screen, fireEvent } from '@testing-library/react-native';
import {
    Button,
    Card,
    ErrorMessage,
    Input,
    Loading,
    OfflineBanner,
    PendingSyncBanner
} from '../../src/components';

describe('UI Base Components', () => {
    describe('Button', () => {
        it('renders with title and calls onPress', () => {
            const onPress = jest.fn();
            render(<Button title="Submit" onPress={onPress} />);
            expect(screen.getByText('Submit')).toBeTruthy();
            fireEvent.press(screen.getByText('Submit'));
            expect(onPress).toHaveBeenCalledTimes(1);
        });

        it('does not call onPress when disabled or loading', () => {
            const onPress = jest.fn();
            const { rerender } = render(<Button title="Btn" onPress={onPress} disabled />);
            fireEvent.press(screen.getByText('Btn'));
            expect(onPress).not.toHaveBeenCalled();

            rerender(<Button title="Btn" onPress={onPress} loading />);
            fireEvent.press(screen.getByText('Btn'));
            expect(onPress).not.toHaveBeenCalled();
        });
    });

    describe('Card', () => {
        it('renders children', () => {
            render(<Card><Text>Content</Text></Card>);
            expect(screen.getByText('Content')).toBeTruthy();
        });
    });

    describe('Input', () => {
        it('renders with label and calls onChangeText', () => {
            const onChange = jest.fn();
            render(<Input label="Label" placeholder="Place" onChangeText={onChange} value="" />);
            expect(screen.getByText('Label')).toBeTruthy();
            fireEvent.changeText(screen.getByPlaceholderText('Place'), 'val');
            expect(onChange).toHaveBeenCalledWith('val');
        });

        it('shows error message', () => {
            render(<Input placeholder="In" error="Required" value="" onChangeText={() => { }} />);
            expect(screen.getByText('Required')).toBeTruthy();
        });
    });

    describe('Feedback Components (Loading, ErrorMessage)', () => {
        it('Loading renders with optional message', () => {
            const { rerender } = render(<Loading />);
            expect(screen.toJSON()).toBeTruthy();
            rerender(<Loading message="Wait" />);
            expect(screen.getByText('Wait')).toBeTruthy();
        });

        it('ErrorMessage renders only when message is provided', () => {
            const { toJSON, rerender } = render(<ErrorMessage message="" />);
            expect(toJSON()).toBeNull();
            rerender(<ErrorMessage message="Fail" />);
            expect(screen.getByText('Fail')).toBeTruthy();
        });
    });

    describe('Banners (Offline, PendingSync)', () => {
        it('OfflineBanner shows message when visible', () => {
            const { toJSON, rerender } = render(<OfflineBanner visible={false} />);
            expect(toJSON()).toBeNull();
            rerender(<OfflineBanner visible={true} />);
            expect(screen.getByText(/No connection/)).toBeTruthy();
        });

        it('PendingSyncBanner shows count', () => {
            const { rerender } = render(<PendingSyncBanner visible={true} count={0} />);
            expect(screen.getByText(/Data pending sync/)).toBeTruthy();
            rerender(<PendingSyncBanner visible={true} count={5} />);
            expect(screen.getByText(/5 pending item/)).toBeTruthy();
        });
    });
});
