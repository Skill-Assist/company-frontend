import { FormEvent, useRef, useState, useEffect, ChangeEvent } from 'react';
import cookie from 'react-cookies';
import Image from 'next/image';
import InputMask from 'react-input-mask';
import { toast } from 'react-hot-toast';
import { TailSpin, ThreeDots } from 'react-loader-spinner';
import { BiPencil } from 'react-icons/bi';

import Layout from '@/components/layout';

import userService from '@/services/userService';

import { User } from '@/types/user';

import styles from './styles.module.scss';

const Profile = () => {
  const [user, setUser] = useState<User>();
  const [pageLoading, setPageLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [nationalId, setNationalId] = useState('');
  const [mobilePhone, setMobilePhone] = useState('');
  const [selectedFile, setSelectedFile] = useState<File>();
  const [logo, setLogo] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  const updateProfileHandler = async (event: FormEvent) => {
    event.preventDefault();

    const name = nameInputRef.current?.value;
    const email = emailInputRef.current?.value;

    if (!name || !email) {
      toast.error('Preencha todos os campos', {
        duration: 3000,
        position: 'top-center',
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
      toast.success('Perfil atualizado com sucesso', {
        duration: 3000,
        position: 'top-center',
      });
      setIsEditing(false);
      return;
    }
  };

  const editPhotoHandler = async (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    setIsEditing(true);

    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }

    const formData = new FormData();

    if (selectedFile) {
      formData.append('file', selectedFile);
    }

    const response = await userService.update(formData);

    if (response.status >= 200 && response.status < 300) {
      setLogo(response.data.logo);
      toast.success('Foto atualizada com sucesso', {
        duration: 3000,
        position: 'top-center',
      });
      setIsEditing(false);
    } else {
      toast.error('Erro ao atualizar foto', {
        duration: 3000,
        position: 'top-center',
      });
      setIsEditing(false);
    }
  };

  useEffect(() => {
    const user = localStorage.getItem('skillAssistUser');
    if (user) {
      setUser(JSON.parse(user));
      setMobilePhone(JSON.parse(user).mobilePhone);
      setNationalId(JSON.parse(user).nationalId);
      setPageLoading(false);
    }
  }, []);

  if (pageLoading) {
    return (
      <Layout sidebar header>
        <div className="loadingContainer">
          <TailSpin
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      </Layout>
    );
  } else if (!user) {
    cookie.remove('token');
    toast.error(
      'Erro de conexão. Verifique sua internet e tente novamente...',
      {
        icon: '📶',
      }
    );
    setTimeout(() => {
      window.location.href = `${process.env.NEXT_PUBLIC_LOGIN_URL}`;
    }, 2000);
    return;
  } else
    return (
      <Layout header sidebar goBack>
        <header className={styles.header}>
          <div className={styles.bannner} />
          <div className={styles.mainInfos}>
            <div
              className={styles.imgBx}
              onClick={() => fileInputRef.current?.click()}
            >
              {!isEditing && (
                <>
                  <BiPencil size={30} className={styles.editIcon} />
                  <Image
                    src={logo !== '' ? logo : user.logo}
                    height={100}
                    width={100}
                    alt="profile_picture"
                  />
                  <input
                    ref={fileInputRef}
                    onChange={editPhotoHandler}
                    type="file"
                    name="file"
                    id="file"
                  />
                </>
              )}
              {isEditing && (
                <ThreeDots
                  height="15"
                  width="15"
                  radius="9"
                  color="var(--verde-1)"
                  ariaLabel="three-dots-loading"
                  visible={true}
                />
              )}
            </div>
            <div className={styles.infoContent}>
              <h2>{user.name}</h2>
              <span>{user.email}</span>
            </div>
          </div>
          <div className={styles.profileIntro}>
            <div>
              <h3>
                Perfil do{' '}
                {user.roles[0] === 'candidate' ? 'Candidato' : 'Recrutador'}
              </h3>
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
                  user.roles[0] === 'candidate'
                    ? '999.999.999-99'
                    : '99.999.999/9999-99'
                }
                placeholder={
                  user.roles[0] === 'candidate'
                    ? 'Digite seu CPF'
                    : 'Digite seu CNPJ'
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
                placeholder={'Digite seu email'}
                type="email"
                defaultValue={user.email}
                disabled={true}
                ref={emailInputRef}
              />
            </div>
          </div>
          <hr className={styles.divisor} />
          {/* <div className={styles.row}>
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
                  toast.loading('Feature em desenvolvimento', {
                    duration: 3000,
                    position: 'top-center',
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
          </div> */}
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

export default Profile;
