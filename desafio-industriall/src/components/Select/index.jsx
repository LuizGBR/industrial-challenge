import React, { useRef, useEffect } from "react";
import { useField } from "@unform/core";
import { MyLabel, MySelect, MySpan } from "./style";

function Select({ name, label, children, ...rest }) {
  const selectRef = useRef(null)

  const { fieldName, defaultValue, registerField, error } = useField(name)

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
    <div>
      <MyLabel htmlFor={fieldName}>{label}</MyLabel>

      <MySelect
        id={fieldName}
        ref={selectRef}
        defaultValue={
          defaultValue}
        {...rest}
      >
        {children}
      </MySelect>

      {error && <MySpan className="error">{error}</MySpan>}
    </div>
  )
}

export default Select;
