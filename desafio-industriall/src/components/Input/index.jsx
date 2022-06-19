import { useRef, useEffect } from 'react'
import { useField } from '@unform/core'
import { MyInput, MyLabel, MySpan } from './style'

export default function Input({ name, label, ...rest }) {
  const inputRef = useRef(null)

  const { fieldName, defaultValue, registerField, error } = useField(name)

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
    <>
      {label && <MyLabel htmlFor={fieldName}>{label}</MyLabel>}

      <MyInput
        id={fieldName}
        ref={inputRef}
        defaultValue={defaultValue}
        style={error && {border: '0', outline: '1px solid #dc3545'}}
        {...rest}
      />

      {error && <MySpan className="error">{error}</MySpan>}

      
    </>
  )
}