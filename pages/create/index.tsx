import React, { useState } from 'react'
import styles from './styles.module.scss'
import StepBar from '@/components/stepBar'
import Layout from '@/components/layout'
import InputField from '@/components/inputField'

type Exam = {
  title: string | null;
  subtitle: string | null;
  level: string | null;
  durationInHours: number | null;
  submissionDeadlineInHours: number | null;
  showGrade: boolean | null;
  archiveDate: Date | null;
  isPublic: boolean | null;
}

const Create: React.FC = (user: any) => {
  const [fields, setFields] = useState(
    {
      title: "Developer",
      subtitle: "Backend",
      level: "Senior",
      durationInHours: 120,
      submissionDeadlineInHours: 360,
      showGrade: false,
      archiveDate: new Date(),
      isPublic: true
    }
  )

  const handleChange = (data: any) => {
    const key = Object.getOwnPropertyNames(data)[0]
    setFields({ ...fields, [key]: data[key] })
    console.log(data)
  }

  return (
    <Layout sidebar footer header headerTitle="Criar Teste" active={0} user={user}>
      <div className={styles.create}>
        <div className={styles.container}>
          <StepBar />

          <div className={styles.content}>
            <div className={styles.modal}>
              <div className={styles.fieldsContainer}>
                <InputField type="input" editable title='Categoria' placeholder={fields.title ? '' : 'Sem categoria'} value={fields.title} changeValue={(value: any) => handleChange({ title: value })}
                />

                <InputField type="input" editable title='Subcategoria' placeholder={fields.subtitle ? '' : 'Sem subcategoria'} value={fields.subtitle} changeValue={(value: any) => handleChange({ subtitle: value })}
                />

                <InputField type="input" editable title='Nível' placeholder={fields.level ? '' : 'Sem nível'} value={fields.level} changeValue={(value: any) => handleChange({ level: value })}
                />
              </div>

              <div className={styles.line}></div>

              <div className={styles.fieldsContainer}>
                <InputField type="input" dataType="number" editable title='Duração em Horas' placeholder={fields.durationInHours ? '' : 'Sem prazo'} value={fields.durationInHours} changeValue={(value: any) => handleChange({ durationInHours: value })}
                />

                <InputField type="input" dataType="Date" editable title='Data de Arquivamento' placeholder={fields.archiveDate ? '' : 'Sem arquivamento'} value={fields.archiveDate} changeValue={(value: any) => handleChange({ archiveDate: value })}
                />

                <InputField type="select" dataType='boolean' editable title='Mostrar Notas' placeholder={fields.showGrade ? '' : 'Não mostrar'} value={String(fields.showGrade)} changeValue={(value: any) => handleChange({ showGrade: value })}
                />

                <InputField type="select" dataType='boolean' editable title='Visualização' placeholder={fields.isPublic ? '' : 'Público'} value={String(fields.isPublic)} changeValue={(value: any) => handleChange({ isPublic: value })}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Create