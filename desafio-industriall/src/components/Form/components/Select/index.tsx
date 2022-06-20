import { useRef, useEffect, ReactNode, SelectHTMLAttributes } from 'react'

import { useField} from '@unform/core'
import { MySelect } from './style'

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

  useEffect(() => {
    registerField({
      ref: selectRef,
      name: fieldName,
      getValue: ref => {
        return ref.current?.value
      },
      setValue: (ref, newValue) => {
        ref.current.value = newValue
      },
      clearValue: ref => {
        ref.current.value = ''
      },
    })
  }, [fieldName, registerField])

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
        {children}
      </select>

      {error && <span>{error}</span>}
    </MySelect>
  )
}