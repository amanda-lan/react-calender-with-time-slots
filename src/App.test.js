import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
const mock = new MockAdapter(axios);

mock
    .onGet("http://localhost:3002?postcode=2000")
    .reply(200, {
      name: "value from the api",
    })

test('renders title', () => {
  render(<App />);
  const linkElement = screen.getByText(/Delivery Time Picker/i);
  expect(linkElement).toBeInTheDocument();
});

test('input initial value', () => {
  render(<App />);
  const inputBox = screen.getByRole("postcode-input")
  expect(inputBox.value).toBe("")
})

test('input change value', () => {
  render(<App />);
  const inputBox = screen.getByRole("postcode-input")
  fireEvent.change(inputBox, {target: {value: 2000}})
  expect(inputBox.value).toBe("2000")
})

test('test API call', async () => {
  render(<App />);
  const inputBox = screen.getByRole("postcode-input")
  fireEvent.change(inputBox, {target: {value: 2001}})
  expect(mock.history.get.length).toBe(2)
  expect(mock.history.get[0]['url']).toBe("http://localhost:3002?postcode=2000")
  expect(mock.history.get[1]['url']).toBe("http://localhost:3002?postcode=2001")
})


