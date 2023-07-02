import React, { useEffect, useState } from 'react'
import styles from './styles.module.scss'

import Layout from '@/components/layout'
import Image from 'next/image'

import InputField from '@/components/inputField'
import ExamCardSample from '@/components/examCardSample'

import Photo from 'public/images/user-photo.svg'
import Logo from '/public/images/amazon.svg'
import s3Service from '@/services/s3.service'
import axios from 'axios'
import { flushSync } from 'react-dom'

const Profile: React.FC = (user: any) => {
  const [file, setFile] = useState<any>()
  const [fields, setFields] = useState({
    name: "Amazon",
    email: "rh.team@amazon.com",
    phone: "",
    cnpj: "",
    role: "Recruter",
    color: '#ff0000',
    logo: "https://bucket-skill-assist.s3.sa-east-1.amazonaws.com/recruiter/exam-card-image/1.svg"
  })
  
  const uploadToS3 = async () => {
    // setFields({...fields, logo: ''})
    const response = await s3Service.uploadFile("1", file)
    flushSync(() => {
      setFields({...fields, logo: response.data})
     }, []);
  }

  useEffect(() => {
    console.log(fields)
  }, [fields])

  useEffect(() => {
    if(file) {
      uploadToS3()
    }
  }, [file])

  return (
    <Layout sidebar footer header headerTitle='Perfil' active={0} user={user}>
      <div className={styles.profile}>
        <Image className={styles.profilePhoto} src={Photo} alt='Profile Image' width={140} height={140} />

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

        <ExamCardSample company={{name: fields.name, color: fields.color, logo: fields.logo}} title='Exemplo de Teste' changePhoto={(file: any) => setFile(file.target.files[0])} changeColor={(color: string) => setFields({...fields, color: color})}/>
      </div>
    </Layout>
  )
}

export default Profile