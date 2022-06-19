import { useRef, useEffect} from 'react'
import { useField } from '@unform/core'
import { MyLabel, MySpan, MyTextarea } from './style'

export default function Textarea({ name, label, ...rest }) {
  const textareaRef = useRef(null)
  const { fieldName, defaultValue = '', registerField, error } = useField(name)

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
    <div>
      {label && <MyLabel htmlFor={fieldName}>{label}</MyLabel>}

      <MyTextarea
        ref={textareaRef}
        id={fieldName}
        defaultValue={defaultValue}
        {...rest}
      />

      {error && <MySpan>{error}</MySpan>}
    </div>
  )
}

