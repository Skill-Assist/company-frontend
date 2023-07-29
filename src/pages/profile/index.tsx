import { FC, FormEvent, useRef, useState } from "react";
import { GetServerSideProps } from "next";
import Image from "next/image";
import InputMask from "react-input-mask";
import { AiOutlineCloudUpload } from "react-icons/ai";

import Layout from "@/components/layout";

import { User } from "@/types/user";

import styles from "./styles.module.scss";
import { toast } from "react-hot-toast";
import userService from "@/services/userService";

interface Props {
  user: User;
}

const Profile: FC<Props> = ({ user }: Props) => {
  const [isEditing, setIsEditing] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const [nationalId, setNationalId] = useState(user.nationalId);
  const [mobilePhone, setMobilePhone] = useState(user.mobilePhone);

  const updateProfileHandler = async (event: FormEvent) => {
    event.preventDefault();

    const name = nameInputRef.current?.value;
    const email = emailInputRef.current?.value;

    if (!name || !email) {
      toast.error("Preencha todos os campos", {
        duration: 3000,
        position: "top-right",
      });
      return;
    }

    const data = {
      name,
      // email,
      nationalId,
      mobilePhone,
    };

    const response = await userService.update(data);

    if (response.status >= 200 && response.status < 300) {
      toast.success("Perfil atualizado com sucesso", {
        duration: 3000,
        position: "top-right",
      });
      setIsEditing(false);
      return;
    }
  };

  return (
    <Layout
      header
      sidebar
      sidebarClosed
      goBack
      headerTitle="Profile"
      contentClassName={styles.p0}
    >
      <header className={styles.header}>
        <div className={styles.bannner} />
        <div className={styles.mainInfos}>
          <Image
            src={user.logo}
            height={100}
            width={100}
            alt="profile_picture"
          />
          <div>
            <h2>{user.name}</h2>
            <span>{user.email}</span>
          </div>
        </div>
        <div className={styles.profileIntro}>
          <div>
            <h3>Perfil do recrutador</h3>
            <p>Atualize suas informações detalhes por aqui</p>
          </div>
          <div>
            <button
              disabled={isEditing}
              type="button"
              onClick={() => setIsEditing(true)}
            >
              Editar perfil
            </button>
          </div>
        </div>
      </header>
      <hr className={styles.divisor} />
      <form onSubmit={updateProfileHandler} className={styles.mainContent}>
        <div className={styles.row}>
          <div>
            <h4>Informações pessoais</h4>
            <p>
              Atualize suas informações pessoais <br />
              para que possamos te conhecer.
            </p>
          </div>
          <div className={styles.inputsContainer}>
            <input
              type="text"
              placeholder="Digite seu nome completo aqui"
              defaultValue={user.name}
              disabled={!isEditing}
              ref={nameInputRef}
            />
            <InputMask
              id="nationalId"
              mask={
                user.roles[0] === "candidate"
                  ? "999.999.999-99"
                  : "99.999.999/9999-99"
              }
              placeholder={
                user.roles[0] === "candidate"
                  ? "Digite seu CPF"
                  : "Digite seu CNPJ"
              }
              type="text"
              defaultValue={nationalId}
              onChange={(event) => setNationalId(event.target.value)}
              disabled={!isEditing}
            />
          </div>
        </div>
        <hr className={styles.divisor} />
        <div className={styles.row}>
          <div>
            <h4>Informações de contato</h4>
            <p>
              Deixe suas informações de contato <br />
              atualizadas para que possamos te contatar.
            </p>
          </div>
          <div className={styles.inputsContainer}>
            <InputMask
              mask="(99) 99999-9999"
              type="text"
              placeholder="Digite um telefone de contato"
              defaultValue={mobilePhone}
              onChange={(event) => setMobilePhone(event.target.value)}
              disabled={!isEditing}
            />
            <input
              placeholder={"Digite seu email"}
              type="email"
              defaultValue={user.email}
              disabled={true}
              ref={emailInputRef}
            />
          </div>
        </div>
        <hr className={styles.divisor} />
        <div className={styles.row}>
          <div>
            <h4>Logo</h4>
            <p>
              Atualize sua logo <br />
              para que vejamos sua marca.
            </p>
          </div>
          <div className={styles.updateLogoContainer}>
            <Image
              src={user.logo}
              height={100}
              width={100}
              alt="profile_picture"
            />
            <div
              className={styles.upload}
              style={!isEditing ? { opacity: 0.3 } : {}}
              onClick={() => {
                if (!isEditing) return;
                toast.loading("Feature em desenvolvimento", {
                  duration: 3000,
                  position: "top-right",
                });
              }}
            >
              <input
                id="file-upload"
                type="file"
                accept="png, jpg, jpeg"
                disabled={true}
              />
              <label htmlFor="file-upload">
                <AiOutlineCloudUpload size={20} />
                <span>Upload</span>
              </label>
            </div>
          </div>
        </div>
        <div className={styles.actions}>
          {isEditing && (
            <button type="button" onClick={() => setIsEditing(false)}>
              Cancelar
            </button>
          )}
          <button disabled={!isEditing} type="submit">
            Salvar mudanças
          </button>
        </div>
      </form>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context;
  const { token } = req.cookies;

  const userResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/user/profile`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const user = await userResponse.json();

  return {
    props: {
      user,
    },
  };
};

export default Profile;
