import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import ViewApplicationsScreen from '..../screens/ViewApplicationsScreen';
import { useUser } from '..../UserContext';

// Mock the useUser hook
jest.mock('..../UserContext', () => ({
  useUser: jest.fn(),
}));

const mockUser = {
  email: 'btselwam@gmail.com',
  password: 'Tamil@1999',
  // Add other properties as needed
};

// Use this mock in your test
beforeEach(() => {
  useUser.mockReturnValue({ user: mockUser, loading: false });
});

const renderWithNavigation = (component) => {
  return render(
    <NavigationContainer>
      {component}
    </NavigationContainer>
  );
};

test('renders application data correctly', async () => {
  const { getByText } = renderWithNavigation(<ViewApplicationsScreen />);
  // Add assertions here
});

test('updates application status correctly', async () => {
  const { getByText } = renderWithNavigation(<ViewApplicationsScreen />);
  // Add assertions here
});
