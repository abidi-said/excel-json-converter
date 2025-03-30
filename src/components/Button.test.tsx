import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button Component', () => {
  it('renders with the correct label', () => {
    render(<Button label="Click me" className="bg-blue-500" />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('applies custom className correctly', () => {
    render(<Button label="Custom Style" className="bg-red-500 text-white" />);
    const button = screen.getByText('Custom Style');
    expect(button).toHaveClass('bg-red-500');
    expect(button).toHaveClass('text-white');
    expect(button).toHaveClass('px-4');
    expect(button).toHaveClass('py-2');
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button label="Click Test" className="bg-green-500" onClick={handleClick} />);
    
    const button = screen.getByText('Click Test');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('forwards additional props to the button element', () => {
    render(
      <Button 
        label="Disabled Button" 
        className="bg-gray-400" 
        disabled 
        data-testid="disabled-btn"
        aria-label="Disabled button example"
      />
    );
    
    const button = screen.getByText('Disabled Button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('data-testid', 'disabled-btn');
    expect(button).toHaveAttribute('aria-label', 'Disabled button example');
  });

  it('can be found by its role', () => {
    render(<Button label="Role Test" className="bg-purple-500" />);
    const button = screen.getByRole('button', { name: 'Role Test' });
    expect(button).toBeInTheDocument();
  });

  it('combines default classes with custom classes', () => {
    render(<Button label="Class Test" className="font-bold" />);
    const button = screen.getByText('Class Test');
    
    expect(button.className).toBe('px-4 py-2 font-bold');
  });
});