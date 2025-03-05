'use client'

import { RegisterOptions, UseFormRegister } from 'react-hook-form';

interface InputProps {
  type: string;
  placeholder: string;
  name: string;
  register: UseFormRegister<any>;
  error?: string;
  rules?: RegisterOptions;
  disabled?: boolean;  // Adicionando a propriedade disabled
}

export function Input({ name, placeholder, register, type, error, rules, disabled }: InputProps) {
  return (
    <>
      <input
        className='w-full border-2 rounded-md h-11 px-4'
        placeholder={placeholder}
        type={type}
        {...register(name, rules)}
        id={name}
        disabled={disabled} // Passando o disabled para o input nativo
      />
      {error && <p className='text-red-500 my-1'>{error}</p>}
    </>
  )
}
