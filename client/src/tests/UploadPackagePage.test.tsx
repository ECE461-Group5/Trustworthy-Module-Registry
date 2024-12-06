// import React from 'react';
// import { render, screen, fireEvent } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
// import UploadPackagePage from '../../components/UploadPackagePage.tsx';
// import '@testing-library/jest-dom';

// describe('UploadPackagePage Component', () => {
//   test('renders the component with input fields and button', () => {
//     // Render the component
//     render(<UploadPackagePage />);

//     // Check for input fields and button
//     expect(screen.getByPlaceholderText('Enter package name')).toBeInTheDocument();
//     expect(screen.getByPlaceholderText('Paste package URL')).toBeInTheDocument();
//     expect(screen.getByText('Upload Package')).toBeInTheDocument();
//   });

//   test('allows the user to enter package name and URL', async () => {
//     // Render the component
//     render(<UploadPackagePage />);

//     // Simulate user entering package name and URL
//     const packageNameInput = screen.getByPlaceholderText('Enter package name');
//     const packageURLInput = screen.getByPlaceholderText('Paste package URL');

//     await userEvent.type(packageNameInput, 'Test Package');
//     await userEvent.type(packageURLInput, 'http://example.com/package.zip');

//     // Check the values
//     expect(packageNameInput).toHaveValue('Test Package');
//     expect(packageURLInput).toHaveValue('http://example.com/package.zip');
//   });

//   test('triggers the upload process when the button is clicked', async () => {
//     // Mock the fetch API call
//     const fetchMock = jest.spyOn(global, 'fetch').mockImplementation(() =>
//       Promise.resolve({
//         ok: true,
//         status: 200,
//         statusText: 'OK',
//         headers: new Headers(),
//         redirected: false,
//         type: 'basic',
//         url: '',
//         clone: jest.fn(),
//         body: null,
//         bodyUsed: false,
//         arrayBuffer: jest.fn(),
//         blob: jest.fn(),
//         formData: jest.fn(),
//         text: jest.fn(),
//         json: () => Promise.resolve({ message: 'Success' }),
//       } as Response)
//     );

//     // Render the component
//     render(<UploadPackagePage />);

//     // Fill the form
//     const packageNameInput = screen.getByPlaceholderText('Enter package name');
//     const packageURLInput = screen.getByPlaceholderText('Paste package URL');
//     await userEvent.type(packageNameInput, 'Test Package');
//     await userEvent.type(packageURLInput, 'http://example.com/package.zip');

//     // Click the upload button
//     const uploadButton = screen.getByText('Upload Package');
//     fireEvent.click(uploadButton);

//     // Assert the fetch call
//     expect(global.fetch).toHaveBeenCalledWith(
//       '/api/upload-package',
//       expect.objectContaining({
//         method: 'POST',
//       })
//     );

//     // Clean up the mock
//     fetchMock.mockRestore();
//   });
// });


import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UploadPackagePage from '../../components/UploadPackagePage.tsx';
import '@testing-library/jest-dom';

describe('UploadPackagePage Component', () => {
  afterEach(() => {
    jest.restoreAllMocks(); // Clean up any mocked global functions
  });

  test('renders the component with input fields and button', () => {
    // Render the component
    render(<UploadPackagePage />);

    // Check for input fields and button
    expect(screen.getByPlaceholderText('Enter package name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Paste package URL')).toBeInTheDocument();
    expect(screen.getByText('Upload Package')).toBeInTheDocument();
  });

  test('allows the user to enter package name and URL', async () => {
    // Render the component
    render(<UploadPackagePage />);

    // Simulate user entering package name and URL
    const packageNameInput = screen.getByPlaceholderText('Enter package name');
    const packageURLInput = screen.getByPlaceholderText('Paste package URL');

    await userEvent.type(packageNameInput, 'Test Package');
    await userEvent.type(packageURLInput, 'http://example.com/package.zip');

    // Check the values
    expect(packageNameInput).toHaveValue('Test Package');
    expect(packageURLInput).toHaveValue('http://example.com/package.zip');
  });

  test('triggers the upload process when the button is clicked', async () => {
    // Mock the fetch API call
    const fetchMock = jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'Success' }),
      } as Response)
    );

    // Render the component
    render(<UploadPackagePage />);

    // Fill the form
    const packageNameInput = screen.getByPlaceholderText('Enter package name');
    const packageURLInput = screen.getByPlaceholderText('Paste package URL');
    await userEvent.type(packageNameInput, 'Test Package');
    await userEvent.type(packageURLInput, 'http://example.com/package.zip');

    // Click the upload button
    const uploadButton = screen.getByText('Upload Package');
    fireEvent.click(uploadButton);

    // Assert the fetch call
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/upload-package',
      expect.objectContaining({
        method: 'POST',
      })
    );

    // Clean up the mock
    fetchMock.mockRestore();
  });

  test('handles API errors gracefully', async () => {
    // Mock a failed API call
    const fetchMock = jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ message: 'Internal Server Error' }),
      } as Response)
    );

    // Render the component
    render(<UploadPackagePage />);

    // Fill the form
    const packageNameInput = screen.getByPlaceholderText('Enter package name');
    const packageURLInput = screen.getByPlaceholderText('Paste package URL');
    await userEvent.type(packageNameInput, 'Test Package');
    await userEvent.type(packageURLInput, 'http://example.com/package.zip');

    // Click the upload button
    const uploadButton = screen.getByText('Upload Package');
    fireEvent.click(uploadButton);

    // Assert that an error message is shown
    expect(await screen.findByText(/Internal Server Error/i)).toBeInTheDocument();

    // Clean up the mock
    fetchMock.mockRestore();
  });
});
