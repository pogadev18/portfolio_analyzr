import type { InputProps } from '@/root/types';

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  type?: 'date' | 'number';
  inputProps?: InputProps;
}

const inputStyles =
  'block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500';

// !TODO: extend code to support <select> and <textarea>
const FormField = (props: FormFieldProps) => {
  return (
    <>
      <label htmlFor={props.id} className="mb-2 block text-sm font-medium ">
        {props.label}
      </label>
      <input
        className={inputStyles}
        type={props.type ?? 'text'}
        id={props.id}
        {...(props.inputProps ?? {})}
      />
      {props.error ? <span className="text-sm font-bold text-red-900">{props.error}</span> : null}
    </>
  );
};

export default FormField;
