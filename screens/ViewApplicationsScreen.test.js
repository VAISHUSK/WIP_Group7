import React from 'react';
import { render, waitFor, fireEvent, screen } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import ViewApplicationsScreen from './ViewApplicationsScreen';
import * as firestore from 'firebase/firestore';

// Mock Firestore functions
jest.mock('firebase/firestore');

// Mock RNPickerSelect
jest.mock('react-native-picker-select', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(({ onValueChange, ...props }) => (
    <select onChange={(e) => onValueChange(e.target.value)} {...props} />
  )),
}));

const renderWithNavigation = (component) => {
  return render(
    <NavigationContainer>
      {component}
    </NavigationContainer>
  );
};

describe('ViewApplicationsScreen', () => {
  beforeEach(() => {
    // Set up Firestore mocks before each test
    firestore.collection.mockReturnValue({});
    firestore.query.mockReturnValue({});
    firestore.where.mockReturnValue({});
    firestore.onSnapshot.mockImplementation((query, callback) => {
      callback({
        forEach: (cb) => {
          cb({
            id: '1',
            data: () => ({
              applicantName: 'Vishwa',
              applicantEmail: 'vishwa@example.com',
              status: 'Applied',
            }),
          });
        },
      });
      return jest.fn();
    });
    firestore.doc.mockReturnValue({});
    firestore.updateDoc.mockResolvedValue({});
  });

  it('renders application data correctly', async () => {
    renderWithNavigation(<ViewApplicationsScreen />);

    await waitFor(() => {
      expect(screen.getByText('Name: Vishwa')).toBeTruthy();
      expect(screen.getByText('Email: vishwa@example.com')).toBeTruthy();
    });
  });

  it('updates application status correctly', async () => {
    renderWithNavigation(<ViewApplicationsScreen />);

    // Simulate status change
    const statusPicker = screen.getByPlaceholderText('Select status...');
    fireEvent.change(statusPicker, { target: { value: 'Interview' } });

    await waitFor(() => {
      expect(firestore.updateDoc).toHaveBeenCalledWith(
        expect.anything(),
        { status: 'Interview' }
      );
    });
  });
});
