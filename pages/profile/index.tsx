import React, { useState } from 'react'
import styles from './styles.module.scss'

import Layout from '@/components/layout'
import Image from 'next/image'

import InputField from '@/components/inputField'
import ExamCardSample from '@/components/examCardSample'

import Photo from 'public/images/user-photo.svg'
import Logo from '/public/images/amazon.svg'

const Profile: React.FC = (user: any) => {
  const [fields, setFields] = useState({
    name: "Amazon",
    email: "rh.team@amazon.com",
    phone: "",
    cnpj: "",
    role: "Recruter",
    color: '#ff0000',
    logo: Logo
  })

  return (
    <Layout sidebar footer header headerTitle='Perfil' active={0} user={user}>
      <div className={styles.profile}>
        <Image src={Photo} alt='Profile Image' width={140} height={140} />

        <div className={styles.grid}>
          <div className={styles.inputContainer}>
            <InputField title='Empresa' editable type='input' placeholder={fields.name.length < 1 ? 'Não adicionado' : ''} value={fields.name} changeValue={(value) => setFields({ ...fields, name: value })} />
          </div>

          <div className={styles.inputContainer}>
            <InputField title='E-mail' placeholder={fields.email.length < 1 ? 'Sem nome' : ''} value={fields.email}/>
          </div>

          <div className={styles.inputContainer}>
            <InputField title='Telefone' editable type='input' placeholder={fields.phone.length < 1 ? 'Não adicionado' : ''} value={fields.phone} changeValue={(value) => setFields({ ...fields, phone: value })} />
          </div>

          <div className={styles.inputContainer}>
            <InputField title='CNPJ' editable type='input' placeholder={fields.cnpj.length < 1 ? 'Não adicionado' : ''} value={fields.cnpj} changeValue={(value) => setFields({ ...fields, cnpj: value })}/>
          </div>

          <div className={styles.inputContainer}>
            <InputField title='Cargo' placeholder={fields.role.length < 1 ? 'Sem nome' : ''} value={fields.role}/>
          </div>
        </div>

        <div className={styles.line}></div>

        <h3 className={styles.title}>Personalizar</h3>

        <ExamCardSample company={{name: fields.name, color: fields.color, logo: fields.logo}} title='Exemplo de Teste'/>
      </div>
    </Layout>
  )
}

export default Profile