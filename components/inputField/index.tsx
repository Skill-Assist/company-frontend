import React, { useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Mask from "@/utils/mask";

interface InputField {
  title: string;
  type?: "select" | "input" | "textarea";
  dataType?: "text" | "number" | "Date";
  options?: any
  regex?: string;
  value: string | number | any;
  defaultValue?: string | number | any;
  text?: string;
  placeholder?: string;
  editable?: boolean;
  deletable?: boolean;
  changeValue?: (value: string) => void;
  onDelete?: () => void;
}

const InputField: React.FC<InputField> = ({
  deletable,
  editable,
  title,
  type,
  dataType,
  options,
  regex,
  value,
  defaultValue,
  text,
  placeholder,
  changeValue,
  onDelete,
}: InputField) => {
  const [edit, setEdit] = useState<boolean>(false)
  const [newValue, setNewValue] = useState<any>(value)

  const generateField = () => {
    switch (type) {
      case "input":
        return (
          <form onSubmit={(e) => e.preventDefault()}>
            <input
              id={`${title}_edit`}
              type={dataType ? dataType : 'text'}
              pattern={regex ? regex : ""}
              value={newValue ? newValue : ""}
              onChange={(e) => handleChange(e.target.value)}
              onBlur={() => handleEdit()}
              onKeyDown={(e) => dataType == "Date" ? e.preventDefault() : handleKeyPress(e)}
            />
          </form>
        );
      case "select":
        return (
          <select autoFocus={true} id={`${title}_edit`} value={newValue} onChange={(e) => handleChange(e.target.value)} onBlur={() => handleEdit()}>
            {
              defaultValue && <option value={defaultValue} hidden>{defaultValue}</option>
            }
            {
              options.map((option: any, index: number) => {
                return <option value={option.value} key={index}>{option.text}</option>
              })
            }
          </select>
        )
      case "textarea":
        return (
          <textarea
            id={`${title}_edit`}
            value={newValue}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={() => handleEdit()}
          />
        )
      default:
        return false
    }
  }

  const handleChange = (value: any) => {
    if (!regex) {
      setNewValue(value)
    } else {
      switch (regex) {
        case "phone":
          setNewValue(Mask.phone(value))
          break;
        case "cnpj":
          setNewValue(Mask.cnpj(value))
          break
        default:
          break
      }
    }
  }

  const handleEdit = () => {
    if (changeValue) {
      changeValue(newValue);
    }
    setEdit(false);
  };

  const handleKeyPress = (e: any) => {
    if (e.keyCode === 13) {
      e.target.blur();
    }
  }

  const handleText = () => {
    if (placeholder) {
      return placeholder
    }
    else if (text) {
      return text
    }
    else if (options) {
      const filter = options.find((item: any) => {
        console.log(item.value, newValue)
        return String(item.value) == String(newValue)
      })
      if(filter) {
        return filter.text
      }
    }
    return String(value)
  }

  useEffect(() => {
    if (edit) {
      const element = document.getElementById(`${title}_edit`);

      if (element) {
        element.focus()
      }
    }
  })

  useEffect(() => {
    if (options) {
      handleEdit()
    }
  }, [newValue])

  useEffect(() => {
    setNewValue(value)
  }, [value]);

  return (
    <div className={styles.inputField}>
      <div className={styles.titleField}>
        <h3>{title}</h3>{" "}
          {editable && <EditIcon onClick={() => setEdit(true)} />}
          {deletable && <DeleteIcon className={styles.delete} onClick={() => onDelete && onDelete()} />}
      </div>
      {editable && edit ? (
        generateField()
      ) : (
        <p>{handleText()}</p>
      )}
    </div>
  );
};

export default InputField;
