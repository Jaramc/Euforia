import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Counter from '../Counter';

describe('Counter component', () => {
  it('should render with initial count 0', () => {
    const { getByTestId } = render(<Counter />);
    expect(getByTestId('count').props.children).toBe(0);
  });

  it('should increment count on button press', () => {
    const { getByTestId, getByText } = render(<Counter />);
    fireEvent.press(getByText('Increment'));
    expect(getByTestId('count').props.children).toBe(1);
  });
});
