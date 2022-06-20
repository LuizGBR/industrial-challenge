import { useRef, useEffect, TextareaHTMLAttributes} from 'react'
import { useField } from '@unform/core'
import { MyTextarea } from './style'

interface Props {
  name: string
  label?: string
}

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & Props

export default function Textarea({ name, label, ...rest }: TextareaProps) {
  const textareaRef = useRef(null)
  const { fieldName, defaultValue = '', registerField, error } = useField(name)
  const styledError =  error ? {border: '0', outline: '1px solid #dc3545'} : {}

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: textareaRef,
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
    <MyTextarea>
      {label && <label htmlFor={fieldName}>{label}</label>}

      <textarea
        ref={textareaRef}
        id={fieldName}
        defaultValue={defaultValue}
        style={styledError}
        {...rest}
      />

      {error && <span>{error}</span>}
    </MyTextarea>
  )
}

