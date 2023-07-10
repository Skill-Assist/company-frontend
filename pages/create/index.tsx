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
  statement: string;
  type: 'text' | 'multipleCoice' | 'programming' | 'challenge' | '';
}

type Section = {
  title: string
  description: string;
  questions: Question[];
  hasProctoring: boolean;
}

const Create: React.FC = (user: any) => {
  const [step, setStep] = useState(0)
  const [actualSection, setActualSection] = useState(-1)
  const [actualQuestion, setActualQuestion] = useState(-1)
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

  const questionTypeOptions = [
    {
      value: "text",
      text: "Texto"
    },
    {
      value: "multipleChoice",
      text: "Múltipla Escolha"
    },
    {
      value: "programming",
      text: "Programação"
    },
    {
      value: "challenge",
      text: "Desafio"
    }
  ]

  const proctoringOptions = [
    {
      value: true,
      text: "Sim"
    },
    {
      value: false,
      text: "Não"
    }
  ]

  const handleChange = (data: any) => {
    const key = Object.getOwnPropertyNames(data)[0]
    if (data[key]) {
      setFields({ ...fields, [key]: data[key] })
    }
  }

  const changeStep = (value: number) => {
    console.log(value, actualSection, actualQuestion)
    if (value == 2 && actualSection == -1) {
      return false
    }
    else if (value == 3 && actualQuestion == -1) {
      return false
    }
    else {
      setStep(value)
    }
  }

  const handleSections = (value: number) => {
    if (value > sections.length) {
      let newSections: Section[] = []
      for (let i = sections.length; i < value; i++) {
        newSections.push({
          title: '',
          description: '',
          questions: [],
          hasProctoring: false
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
    else {
      setSections([
        {
          title: '',
          description: '',
          questions: [],
          hasProctoring: false
        }
      ])
    }
  }

  const handleQuestions = (value: number, index: number) => {
    let questions = [...sections[index].questions]
    if (value > questions.length) {
      let newSections = [...sections]
      let newQuestions: Question[] = [...questions]
      for (let i = questions.length; i < value; i++) {
        newQuestions.push({
          title: '',
          statement: '',
          type: ''
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

  const goToSection = (section: number) => {
    setActualSection(section)
    setStep(2)
  }

  const goToQuestion = (question: number) => {
    setActualQuestion(question)
    setStep(3)
  }

  const updateSection = (data: any) => {
    const key = Object.getOwnPropertyNames(data)[0]
    let newSections: Section[] = [...sections]
    let newSection = { ...newSections[actualSection], [key]: data[key] }
    newSections[actualSection] = newSection
    setSections(newSections)
  }

  const updateQuestion = (data: any, index: number) => {
    const key = Object.getOwnPropertyNames(data)[0]
    let newSections: Section[] = [...sections]
    let newQuestion = { ...newSections[actualSection].questions[index], [key]: data[key] }
    newSections[actualSection].questions[index] = newQuestion
    setSections(newSections)
  }

  const deleteSection = (index: number) => {
    let newSections: Section[] = [...sections]
    newSections.splice(index, 1)
    setSections(newSections)
  }

  const deleteQuestion = (index: number) => {
    let newSections: Section[] = [...sections]
    newSections[actualSection].questions.splice(index, 1)
    setSections(newSections)
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

              <InputField type="select" options={publicOptions} editable title='Visualização' defaultValue="Escolha a visibilidade" placeholder={fields.isPublic ? '' : 'Público'} value={String(fields.isPublic)} changeValue={(value: any) => handleChange({ isPublic: value })}
              />
            </div>

            <div className={styles.buttonsContainer}>
              <Button text='Preview' type='cancel' />
              <Button text='Próximo' type='submit' onClick={() => changeStep(step + 1)} />
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
                    <InputField type="input" dataType='number' deletable editable title={`Seção ${index + 1}`} text={`${item.questions.length} questões`} placeholder={item.questions.length ? '' : 'Sem questões'} value={item.questions.length} changeValue={(value: any) => handleQuestions(Number(value), index)} onDelete={() => deleteSection(index)}
                    />
                    <AiOutlineRight size={20} onClick={() => goToSection(index)} />
                  </div>
                )
              })
            }
            <div className={styles.singleField}>
              <Button text='Adicionar' type='cancel' onClick={() => handleSections(sections.length + 1)} />
            </div>
          </div>
        )
      case 2:
        return (
          <div className={styles.modal}>
            <div className={`${styles.fieldsContainer} ${styles.padding} ${styles.mb}`}>
              <InputField type="input" editable title='Título' placeholder={sections[actualSection].title ? '' : 'Sem nome'} value={sections[actualSection].title} changeValue={(value: any) => updateSection({ title: value })}
              />
              <InputField type="select" options={proctoringOptions} editable title='Proctoring' placeholder={sections[actualSection].hasProctoring ? '' : 'Não'} value={String(sections[actualSection].hasProctoring)} changeValue={(value: any) => updateSection({ hasProctoring: value })}
              />
            </div>

            <div className={styles.singleField}>
              <InputField type="textarea" editable title='Descrição' placeholder={sections[actualSection].description ? '' : 'Sem descrição'} value={sections[actualSection].description} changeValue={(value: any) => updateSection({ description: value })}
              />
            </div>

            <div className={styles.line}></div>

            {
              sections[actualSection].questions.length > 0 ?
                sections[actualSection].questions.map((item, index) => {
                  return (
                    <div className={`${styles.fieldsContainer} ${styles.borded} ${styles.padding}`} key={index}>
                      <InputField type="select" options={questionTypeOptions} deletable editable title={`Questão ${index + 1}`} placeholder={item.type ? '' : 'Não definida'} defaultValue="Escolha um tipo" value={String(item.type)} changeValue={(value: any) => updateQuestion({ type: value }, index)} onDelete={() => deleteQuestion(index)}
                      />
                      <AiOutlineRight size={20} onClick={() => goToQuestion(index)} />
                    </div>
                  )
                })
                :
                <div className={`${styles.fieldsContainer} ${styles.padding}`}>Nenhuma questão adicionada</div>
            }
            <div className={styles.singleField}>
              <Button text='Adicionar' type='cancel' onClick={() => handleQuestions(sections[actualSection].questions.length + 1, actualSection)} />
            </div>
          </div>
        )
      case 3:
        return (
          <div className={styles.modal}>
            <div className={`${styles.fieldsContainer} ${styles.padding} ${styles.mb}`}>
              <InputField type="input" editable title='Título' placeholder={sections[actualSection].questions[actualQuestion].title ? '' : 'Sem nome'} value={sections[actualSection].questions[actualQuestion].title} changeValue={(value: any) => updateQuestion({ title: value }, actualQuestion)}
              />
              <InputField type="select" options={questionTypeOptions} editable title="Tipo" placeholder={sections[actualSection].questions[actualQuestion].type ? '' : 'Não definida'} defaultValue="Escolha um tipo" value={String(sections[actualSection].questions[actualQuestion].type)} changeValue={(value: any) => updateQuestion({ type: value }, actualQuestion)}
              />
            </div>
            <div className={`${styles.fieldsContainer} ${styles.padding} ${styles.mb}`}>
              <InputField type="textarea" editable title='Enunciado' placeholder={sections[actualSection].questions[actualQuestion].statement ? '' : 'Sem enunciado'} value={sections[actualSection].questions[actualQuestion].statement} changeValue={(value: any) => updateQuestion({ statement: value }, actualQuestion)}
              />
            </div>
            <div className={styles.buttonsContainer}>
              <Button type="cancel" text="Preview" />
              <Button type="submit" text="Próximo" onClick={() => changeStep(step + 1)} />
            </div>
          </div>
        )
    }
  }

  return (
    <Layout sidebar footer header headerTitle="Criar Teste" active={0} user={user}>
      <div className={styles.create}>
        <div className={styles.container}>
          <StepBar actualStep={step} changeStep={(value: number) => changeStep(value)} />

          <div className={styles.content}>
            {generatePage()}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Create