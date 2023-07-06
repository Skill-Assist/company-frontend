import React, { useState } from 'react'
import styles from './styles.module.scss'
import StepBar from '@/components/StepBar'
import Layout from '@/components/Layout'
import InputField from '@/components/InputField'
import Button from '@/components/Button'

import { AiOutlineRight } from 'react-icons/ai'

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

type Question = {
  title: string;
}

type Section = {
  title: string
  questions: Question[];
}

const Create: React.FC = (user: any) => {
  const [step, setStep] = useState(1)
  const [sections, setSections] = useState<Section[]>([])
  const [fields, setFields] = useState(
    {
      title: "Developer",
      subtitle: "Backend",
      level: "Senior",
      durationInHours: 120,
      submissionDeadlineInHours: 200,
      showGrade: false,
      archiveDate: "02-07-2023",
      isPublic: false
    }
  )

  const publicOptions = [
    {
      value: true,
      text: "Público"
    },
    {
      value: false,
      text: "Privado"
    },
  ]

  const showGradeOptions = [
    {
      value: true,
      text: "Mostrar"
    },
    {
      value: false,
      text: "Não mostrar"
    }
  ]

  const handleChange = (data: any) => {
    const key = Object.getOwnPropertyNames(data)[0]
    if (data[key]) {
      setFields({ ...fields, [key]: data[key] })
    }
  }

  const handleSections = (value: number) => {
    if (value > sections.length) {
      let newSections: Section[] = []
      for (let i = sections.length; i < value; i++) {
        newSections.push({
          title: '',
          questions: [
            {
              title: ''
            }
          ]
        })
      }
      setSections([...sections, ...newSections])
    }
    else if (value < sections.length) {
      let newSections: Section[] = [...sections]
      for (let i = sections.length; i > value; i--) {
        newSections.pop()
      }
      setSections(newSections)
    }
    // else if(value == 0) {
    //   setSections([{
    //     questions: 0
    //   }])
    // 
  }

  const handleQuestions = (value: number, index: number) => {
    let questions = [...sections[index].questions]
    if (value > questions.length) {
      let newSections = [...sections]
      let newQuestions: Question[] = [...questions]
      for (let i = questions.length; i < value; i++) {
        newQuestions.push({
          title: ''
        })
      }
      newSections[index].questions = newQuestions
      setSections(newSections)
    }
    else if (value < questions.length) {
      let newSections: Section[] = [...sections]
      for (let i = questions.length; i > value; i--) {
        newSections[index].questions.pop()
      }
      setSections(newSections)
    }
  }

  const generatePage = () => {
    switch (step) {
      case 0:
        return (
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
              <InputField type="input" dataType="number" editable title='Duração' text={`${fields.durationInHours} horas`} placeholder={fields.durationInHours ? '' : 'Sem prazo'} value={fields.durationInHours} changeValue={(value: any) => handleChange({ durationInHours: value })}
              />

              <InputField type="input" dataType="Date" editable title='Data de Arquivamento' placeholder={fields.archiveDate ? '' : 'Sem arquivamento'} value={fields.archiveDate} changeValue={(value: any) => handleChange({ archiveDate: value })}
              />

              <InputField type="input" dataType="number" editable title='Prazo' text={`${fields.submissionDeadlineInHours} horas`} placeholder={fields.submissionDeadlineInHours ? '' : 'Sem prazo'} value={fields.submissionDeadlineInHours} changeValue={(value: any) => handleChange({ submissionDeadlineInHours: value })}
              />

              <InputField type="select" options={showGradeOptions} editable title='Mostrar Notas' placeholder={fields.showGrade ? '' : 'Não mostrar'} value={String(fields.showGrade)} changeValue={(value: any) => handleChange({ showGrade: value })}
              />

              <InputField type="select" options={publicOptions} editable title='Visualização' placeholder={fields.isPublic ? '' : 'Público'} value={String(fields.isPublic)} changeValue={(value: any) => handleChange({ isPublic: value })}
              />
            </div>

            <div className={styles.buttonsContainer}>
              <Button text='Preview' type='cancel' />
              <Button text='Próximo' type='submit' onClick={() => setStep(step + 1)} />
            </div>
          </div>
        )
      case 1:
        return (
          <div className={styles.modal}>
            <div className={`${styles.fieldsContainer} ${styles.padding} ${styles.mb}`}>
              <InputField type="input" dataType='number' editable title='Número de Seções' text={sections.length ? `${sections.length} seções` : ''} placeholder={sections.length ? '' : 'Sem seções'} value={sections.length} changeValue={(value: any) => handleSections(value)}
              />
              <Button type="cancel" text="Preview" />
            </div>

            {sections.length > 0 && <div className={styles.line}></div>}

            {
              sections.map((item, index) => {
                return (
                  <div className={`${styles.fieldsContainer} ${styles.borded} ${styles.padding}`} key={index}>
                    <InputField type="input" dataType='number' editable title={`Seção ${index + 1}`} text={`${sections[index].questions.length} questões`} placeholder={sections[index].questions.length ? '' : 'Sem questões'} value={sections[index].questions.length} changeValue={(value: any) => handleQuestions(Number(value), index)}
                    />
                    <AiOutlineRight size={20} />
                  </div>
                )
              })
            }
          </div>
        )
      case 2:
        return (
          <div className={styles.modal}>
            <div className={`${styles.fieldsContainer} ${styles.padding}`}>
              <InputField type="input" dataType='number' editable title='Número de Seções' placeholder={sections ? '' : 'Sem seções'} value={`${sections.length} seções`} changeValue={(value: any) => handleSections(value)}
              />
              <Button type="cancel" text="Preview" />
            </div>

            <div className={styles.line}></div>

            {
              sections.map((item, index) => {
                return (
                  <div className={`${styles.fieldsContainer} ${styles.borded} ${styles.padding}`} key={index}>
                    <InputField type="input" dataType='number' editable title={`Seção ${index + 1}`} text={sections.length ? `${sections.length} seções` : ''} placeholder={sections.length ? '' : 'Sem seções'} value={`${sections[index].questions} questões`} changeValue={(value: any) => handleQuestions(value, index)}
                    />
                    <AiOutlineRight size={20} />
                  </div>
                )
              })
            }
          </div>
        )
    }
  }

  return (
    <Layout sidebar footer header headerTitle="Criar Teste" active={0} user={user}>
      <div className={styles.create}>
        <div className={styles.container}>
          <StepBar actualStep={step} changeStep={(value: number) => setStep(value)} />

          <div className={styles.content}>
            {generatePage()}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Create