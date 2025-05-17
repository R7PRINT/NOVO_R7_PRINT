import React from 'react';
import { cn } from '../../lib/utils';

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
}

const Form: React.FC<FormProps> = ({ className, children, ...props }) => {
  return (
    <form className={cn('space-y-6', className)} {...props}>
      {children}
    </form>
  );
};

export interface FormGroupProps {
  children: React.ReactNode;
  className?: string;
}

export const FormGroup: React.FC<FormGroupProps> = ({ children, className }) => {
  return <div className={cn('space-y-4', className)}>{children}</div>;
};

export interface FormRowProps {
  children: React.ReactNode;
  className?: string;
}

export const FormRow: React.FC<FormRowProps> = ({ children, className }) => {
  return (
    <div className={cn('grid grid-cols-1 gap-4 sm:grid-cols-2', className)}>
      {children}
    </div>
  );
};

export interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  required?: boolean;
}

export const FormLabel: React.FC<FormLabelProps> = ({
  children,
  required,
  className,
  ...props
}) => {
  return (
    <label
      className={cn('block text-sm font-medium text-gray-700', className)}
      {...props}
    >
      {children}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>
  );
};

export interface FormErrorProps {
  children: React.ReactNode;
  className?: string;
}

export const FormError: React.FC<FormErrorProps> = ({ children, className }) => {
  if (!children) return null;
  return <p className={cn('mt-1 text-sm text-red-600', className)}>{children}</p>;
};

Form.displayName = 'Form';
FormGroup.displayName = 'FormGroup';
FormRow.displayName = 'FormRow';
FormLabel.displayName = 'FormLabel';
FormError.displayName = 'FormError';

export { Form };
export default Form;
