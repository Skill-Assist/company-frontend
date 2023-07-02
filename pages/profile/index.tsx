import React, { SetStateAction, useEffect, useState } from "react";
import styles from "./styles.module.scss";

import Layout from "@/components/layout";
import Image from "next/image";

import InputField from "@/components/inputField";
import ExamCardSample from "@/components/examCardSample";

import Photo from "public/images/user-photo.svg";
import s3Service from "@/services/s3.service";
import { flushSync } from "react-dom";
import userService from "@/services/user.service";

type Profile = {
  id: string;
  name: string;
  email: string;
  mobilePhone: string | null;
  nationalId: string | null;
  roles: string[];
  color: string;
  logo: string | null;
};

const Profile: React.FC = (user: any) => {
  const [file, setFile] = useState<any>();
  const [fields, setFields] = useState<Profile>({
    id: '',
    name: "",
    email: "",
    mobilePhone: "",
    nationalId: null,
    roles: ["recruiter"],
    color: "#ff0000",
    logo: null,
  });

  const getProfile = async () => {
    const response = await userService.getProfile();

    if (response.status === 200) {
      setFields(response.data);
    }
  };

  const handleChange = async (data: any) => {
    const response = await userService.update(data);
    const key = Object.getOwnPropertyNames(data)[0];

    if (response.status == 200) {
      flushSync(() => {
        setFields({ ...fields, [key]: data[key] });
      }, []);
    }
  };

  const uploadToS3 = async () => {
    const response = await s3Service.uploadFile(fields.id, file);
    handleChange({ logo: response.data });
  };

  useEffect(() => {
    if (file && fields.id) {
      uploadToS3();
    }
  }, [file]);

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <Layout sidebar footer header headerTitle="Perfil" active={0} user={user}>
      <div className={styles.profile}>
        <Image
          className={styles.profilePhoto}
          src={Photo}
          alt="Profile Image"
          width={140}
          height={140}
        />

        <div className={styles.grid}>
          <div className={styles.inputContainer}>
            <InputField
              title="Empresa"
              editable
              type="input"
              placeholder={fields.name ? "" : "Não adicionado"}
              value={fields.name}
              changeValue={(value) => handleChange({ name: value })}
            />
          </div>

          <div className={styles.inputContainer}>
            <InputField
              title="E-mail"
              placeholder={fields.email ? "" : "Não adicionado"}
              value={fields.email}
            />
          </div>

          <div className={styles.inputContainer}>
            <InputField
              title="Telefone"
              editable
              type="input"
              regex="phone"
              placeholder={fields.mobilePhone ? "" : "Não adicionado"}
              value={fields.mobilePhone ? fields.mobilePhone : ""}
              changeValue={(value) => handleChange({ mobilePhone: value })}
            />
          </div>

          <div className={styles.inputContainer}>
            <InputField
              title="CNPJ"
              editable
              regex="cnpj"
              type="input"
              placeholder={fields.nationalId ? "" : "Não adicionado"}
              value={fields.nationalId ? String(fields.nationalId) : ""}
              changeValue={(value) => handleChange({ nationalId: value })}
            />
          </div>

          <div className={styles.inputContainer}>
            <InputField
              title="Cargo"
              placeholder={fields.roles ? "" : "Sem cargo"}
              value={fields.roles[0] == 'recruiter' ? 'Recrutador' : 'Candidato'}
            />
          </div>
        </div>

        <div className={styles.line}></div>

        <h3 className={styles.title}>Personalizar</h3>

        <ExamCardSample
          company={{
            name: fields.name,
            color: fields.color,
            logo: fields.logo,
          }}
          title="Exemplo de Teste"
          changePhoto={(file: any) => setFile(file.target.files[0])}
          changeColor={(color: string) => handleChange({ color: color })}
        />
      </div>
    </Layout>
  );
};

export default Profile;
