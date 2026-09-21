/**
 * @file CustomSelect.test.tsx
 * @description Unit test untuk komponen CustomSelect dropdown desktop.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { CustomSelect } from '../CustomSelect';

describe('CustomSelect Component', () => {
  const options = [
    { value: 'tauri', label: 'Tauri v2' },
    { value: 'react', label: 'React 19' },
    { value: 'vite', label: 'Vite Bundler' },
  ];

  it('should_render_trigger_with_selected_option_label', () => {
    // Arrange & Act
    render(
      <CustomSelect
        options={options}
        value="tauri"
        onChange={vi.fn()}
        aria-label="Framework"
      />
    );

    // Assert
    expect(screen.getByText('Tauri v2')).toBeDefined();
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('should_open_popover_when_trigger_button_is_clicked', () => {
    // Arrange
    render(
      <CustomSelect
        options={options}
        value="tauri"
        onChange={vi.fn()}
        aria-label="Framework"
      />
    );
    const trigger = screen.getByRole('button', { name: 'Framework' });

    // Act
    fireEvent.click(trigger);

    // Assert
    const listbox = screen.getByRole('listbox');
    expect(listbox).toBeDefined();
    expect(screen.getByText('React 19')).toBeDefined();
  });

  it('should_call_onChange_and_close_when_option_is_clicked', () => {
    // Arrange
    const handleChange = vi.fn();
    render(
      <CustomSelect
        options={options}
        value="tauri"
        onChange={handleChange}
        aria-label="Framework"
      />
    );
    const trigger = screen.getByRole('button', { name: 'Framework' });

    // Act
    fireEvent.click(trigger);
    const reactOption = screen.getByText('React 19');
    fireEvent.click(reactOption);

    // Assert
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith('react');
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('should_handle_keyboard_navigation_and_selection', () => {
    // Arrange
    const handleChange = vi.fn();
    render(
      <CustomSelect
        options={options}
        value="tauri"
        onChange={handleChange}
        aria-label="Framework"
      />
    );
    const trigger = screen.getByRole('button', { name: 'Framework' });

    // Act 1: Buka dropdown dengan ArrowDown
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    expect(screen.getByRole('listbox')).toBeDefined();

    // Act 2: Pilih opsi dengan Enter
    fireEvent.keyDown(trigger, { key: 'Enter' });

    // Assert
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('should_close_popover_when_Escape_key_is_pressed', () => {
    // Arrange
    render(
      <CustomSelect
        options={options}
        value="tauri"
        onChange={vi.fn()}
        aria-label="Framework"
      />
    );
    const trigger = screen.getByRole('button', { name: 'Framework' });

    // Act
    fireEvent.click(trigger);
    expect(screen.getByRole('listbox')).toBeDefined();

    fireEvent.keyDown(trigger, { key: 'Escape' });

    // Assert
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('should_open_upward_when_space_below_is_insufficient', () => {
    // Arrange
    render(
      <CustomSelect
        options={options}
        value="tauri"
        onChange={vi.fn()}
        aria-label="Framework"
      />
    );
    const trigger = screen.getByRole('button', { name: 'Framework' });
    const container = trigger.parentElement as HTMLElement;

    // Mock getBoundingClientRect agar sisa ruang bawah < 220px
    vi.spyOn(container, 'getBoundingClientRect').mockReturnValue({
      top: 400,
      bottom: 720,
      left: 100,
      right: 300,
      width: 200,
      height: 40,
      x: 100,
      y: 400,
      toJSON: () => ({}),
    });

    // Mock window.innerHeight = 768 (sehingga spaceBelow = 768 - 720 = 48px < 220px)
    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 768 });

    // Act
    fireEvent.click(trigger);

    // Assert
    const listbox = screen.getByRole('listbox');
    expect(listbox.className).toContain('open-upward');
  });

  it('should_render_search_input_when_searchable_is_true', () => {
    // Arrange
    render(
      <CustomSelect
        options={options}
        value="tauri"
        onChange={vi.fn()}
        aria-label="Framework"
        searchable={true}
        searchPlaceholder="Cari framework..."
      />
    );
    const trigger = screen.getByRole('button', { name: 'Framework' });

    // Act
    fireEvent.click(trigger);

    // Assert
    const searchInput = screen.getByPlaceholderText('Cari framework...');
    expect(searchInput).toBeDefined();
  });

  it('should_filter_options_when_typing_in_search_input', () => {
    // Arrange
    render(
      <CustomSelect
        options={options}
        value="tauri"
        onChange={vi.fn()}
        aria-label="Framework"
        searchable={true}
        searchPlaceholder="Cari framework..."
      />
    );
    const trigger = screen.getByRole('button', { name: 'Framework' });

    // Act
    fireEvent.click(trigger);
    const listbox = screen.getByRole('listbox');
    const searchInput = screen.getByPlaceholderText('Cari framework...');
    fireEvent.change(searchInput, { target: { value: 'react' } });

    // Assert: Opsi di dalam listbox terfilter
    expect(within(listbox).getByText('React 19')).toBeDefined();
    expect(within(listbox).queryByText('Tauri v2')).toBeNull();
    expect(within(listbox).queryByText('Vite Bundler')).toBeNull();
  });

  it('should_display_empty_message_when_no_options_match', () => {
    // Arrange
    render(
      <CustomSelect
        options={options}
        value="tauri"
        onChange={vi.fn()}
        aria-label="Framework"
        searchable={true}
        searchPlaceholder="Cari framework..."
      />
    );
    const trigger = screen.getByRole('button', { name: 'Framework' });

    // Act
    fireEvent.click(trigger);
    const listbox = screen.getByRole('listbox');
    const searchInput = screen.getByPlaceholderText('Cari framework...');
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

    // Assert
    expect(within(listbox).getByText('Tidak ada pilihan yang cocok')).toBeDefined();
    expect(within(listbox).queryByText('React 19')).toBeNull();
  });

  it('should_clear_search_query_when_clear_button_is_clicked', () => {
    // Arrange
    render(
      <CustomSelect
        options={options}
        value="tauri"
        onChange={vi.fn()}
        aria-label="Framework"
        searchable={true}
        searchPlaceholder="Cari framework..."
      />
    );
    const trigger = screen.getByRole('button', { name: 'Framework' });

    // Act
    fireEvent.click(trigger);
    const listbox = screen.getByRole('listbox');
    const searchInput = screen.getByPlaceholderText('Cari framework...') as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: 'react' } });
    expect(searchInput.value).toBe('react');

    const clearButton = screen.getByLabelText('Bersihkan pencarian');
    fireEvent.click(clearButton);

    // Assert
    expect(searchInput.value).toBe('');
    expect(within(listbox).getByText('Tauri v2')).toBeDefined();
  });
});
