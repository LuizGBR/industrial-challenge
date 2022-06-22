import { useRef, useEffect, ReactNode, SelectHTMLAttributes, ReactElement } from 'react'

import { useField} from '@unform/core'
import { MySelect } from './style'
import React from 'react'


interface SelectProps {
  name: string
  label: string
  children: ReactNode
}

type Props = SelectHTMLAttributes<HTMLSelectElement> & SelectProps


export default function Select({ name, label, children, ...rest }: Props) {
  const selectRef = useRef<HTMLSelectElement>(null)

  const { fieldName, defaultValue, registerField, error } = useField(name)
  const styledError = error ? {border: '0', outline: '1px solid #dc3545'} : {}

  const optionRefs = useRef<HTMLOptionElement[]>([]);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: optionRefs.current,
      getValue: (refs: HTMLOptionElement[]) => {
        return refs.find((ref) => ref.selected)?.value || "";
      },
      setValue: (refs: HTMLOptionElement[], value: string) => {
        const option = refs.find((ref) => {
          if(ref.value !== null){
            return ref.value === value
          }
          return false;
        });

        if (option) option.selected = true;
      },
      clearValue: (refs: HTMLOptionElement[]) => {
        refs.forEach((ref) => (ref.selected = false));
      }
    });
  }, [fieldName, registerField]);

  return (
    <MySelect>
      <label htmlFor={fieldName}>{label}</label>

      <select
        className={error && 'error'}
        id={fieldName}
        ref={selectRef}
        defaultValue={defaultValue}
        style={styledError}
        {...rest}
      >
        {React.Children.map(children, (child) =>
        React.cloneElement(child as ReactElement, {
          ref: (ref: HTMLOptionElement) => optionRefs.current.push(ref)
        })
      )}
      </select>

      {error && <span>{error}</span>}
    </MySelect>
  )
}
