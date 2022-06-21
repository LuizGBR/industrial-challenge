import { useRef, useEffect, InputHTMLAttributes } from 'react'
import { useField } from '@unform/core'
import { MyInput} from './style'

type InputProps ={
  name: string;
  label: string;
}

type Props = InputHTMLAttributes<HTMLInputElement> & InputProps

export default function Input({ name, label,  ...rest } : Props) {
  const inputRef = useRef(null)

  const { fieldName, defaultValue, registerField, error} = useField(name)
  const styledError = error ? {border: '0', outline: '1px solid #dc3545'} : {}  

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef,
      getValue: ref => {
        return ref.current.value
      },
      setValue: (ref, value) => {
        ref.current.value = value
      },
      clearValue: ref => {
        ref.current.value = ''
      },
    })
  }, [fieldName, registerField])

  return (
    <MyInput>
      {label && <label htmlFor={fieldName}>{label}</label>}

      <input
        id={fieldName}
        ref={inputRef}
        defaultValue={defaultValue}
        style={styledError}
        {...rest}
      />

      {error && <span className="error">{error}</span>}    
    </MyInput>
  )
}