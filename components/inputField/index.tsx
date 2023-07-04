import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";

import EditIcon from "@mui/icons-material/Edit";
import Mask from "@/utils/mask";

interface InputField {
  title: string;
  type?: "select" | "input";
  dataType?: "text" | "number" | "Date";
  options?: any
  regex?: string;
  value: string | number | any;
  placeholder?: string;
  editable?: boolean;
  changeValue?: (value: string) => void;
}

const InputField: React.FC<InputField> = ({
  editable,
  title,
  type,
  dataType,
  options,
  regex,
  value,
  placeholder,
  changeValue,
}: InputField) => {
  const [edit, setEdit] = useState(false);
  const [newValue, setNewValue] = useState<any>(value);

  const generateField = () => {
    switch (type) {
      case "input":
        return (
          <form onSubmit={(e) => e.preventDefault()}>
            <input
              id={`${title}_edit`}
              type={dataType ? dataType : 'text'}
              pattern={regex ? regex : ""}
              value={newValue}
              onChange={(e) => handleChange(e.target.value)}
              onBlur={() => handleEdit()}
              onKeyDown={(e) => dataType == "Date" ? e.preventDefault() : handleKeyPress(e)}
            />
          </form>
        );
      case "select":
        return (
          <select value={newValue} onChange={(e) => handleChange(e.target.value)} onBlur={() => handleEdit()}>
            {
              options.map((option: any, index: number) => {
                return <option value={index} key={index}>{option.text}</option>
              })
            }
          </select>
        )
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
    else if(options) {
     return options[newValue].text
    } 
    return String(value)
  }

  useEffect(() => {
    if (edit) {
      const element = document.getElementById(`${title}_edit`);

      if (element) {
        console.log(element);
        element.focus();
      }
    }
  });

  useEffect(() => {
    setNewValue(value);
  }, [value]);

  return (
    <div className={styles.inputField}>
      <div className={styles.titleField}>
        <h3>{title}</h3>{" "}
        {editable && <EditIcon onClick={() => setEdit(true)} />}
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
