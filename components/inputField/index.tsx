import React, { useEffect, useState } from 'react'
import styles from './styles.module.scss'

import EditIcon from '@mui/icons-material/Edit'

interface InputField {
  title: string;
  type?: 'select' | 'input';
  value: string;
  placeholder?: string;
  editable?: boolean;
  changeValue?: (value: string) => void
}

const InputField: React.FC<InputField> = ({ editable, title, type, value, placeholder, changeValue }: InputField) => {
  const [edit, setEdit] = useState(false)
  const [newValue, setNewValue] = useState<any>(value)

  const generateField = () => {
    switch (type) {
      case 'input':
        return <form onSubmit={(e) => e.preventDefault()}>
          <input id={`${title}_edit`} type="text" value={newValue} onChange={(e) => setNewValue(e.target.value)} onBlur={() => handleEdit()} onKeyDown={(e) => handleKeyPress(e)} />
        </form>
      case 'select':
        return false
    }
  }

  const handleEdit = () => {
    if(changeValue) {
      changeValue(newValue)
    }
    setEdit(false)
  }

  const handleKeyPress = (e: any) => {
    if (e.keyCode === 13) {
      e.target.blur();
    }
  }

  useEffect(() => {
    if (edit) {
      const element = document.getElementById(`${title}_edit`)

      if (element) {
        console.log(element)
        element.focus()
      }
    }
  })

  return (
    <div className={styles.inputField}>
      <div className={styles.titleField}>
        <h3>{title}</h3> {editable && <EditIcon onClick={() => setEdit(true)}/>}
      </div>
      {
        editable && edit ? generateField()
          :
          <p>{placeholder ? placeholder : value}</p>
      }

    </div>
  )
}

export default InputField