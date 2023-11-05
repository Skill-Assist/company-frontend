import { FC, FormEvent, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

import InputField from '../UI/inputField';
import Button from '../UI/button';

import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { CircularProgress } from '@mui/material';

import sectionService from '@/services/sectionService';

import { Section } from '@/types/section';

import styles from './styles.module.scss';
import { useReadableDuration } from '@/hooks/readableDuration';

interface Props {
  sectionIndex: number;
  examDuration: number;
  examId: number;
  onCreateSection: () => void;
  isSuggestion?: boolean;
  suggestionName?: string;
  suggestionDescription?: string;
  sections?: Section[];
  sectionsSuggestions?: {
    name: string;
    description: string;
  }[];
  setSectionsSuggestions?: (value: any) => void;
  setNewSection?: (value: any) => void;
  sectionType?: string;
}

const SectionForm: FC<Props> = ({
  sectionIndex,
  examDuration,
  examId,
  onCreateSection,
  isSuggestion,
  suggestionName,
  suggestionDescription,
  sections,
  sectionsSuggestions,
  setSectionsSuggestions,
  setNewSection,
  sectionType,
}: Props) => {
  const [isSuggestionSection, setIsSuggestionSection] = useState(
    isSuggestion || false
  );
  const [sectionName, setSectionName] = useState(suggestionName || '');
  const [sectionDescription, setSectionDescription] = useState(
    suggestionDescription || ''
  );
  const [sectionWeight, setSectionWeight] = useState(0);
  const [sectionDuration, setSectionDuration] = useState('00:00');

  const [remainingWeight, setRemainingWeight] = useState(1);
  const [remainingDuration, setRemainingDuration] = useState(examDuration);

  const [inputKey, setInputKey] = useState('');

  const [creatingSectionLoading, setCreatingSectionLoading] = useState(false);

  useEffect(() => {
    let totalWeight = 0;
    let totalDuration = 0;

    if (sections) {
      totalWeight = sections.reduce(
        (total, section) => total + Number(section.weight),
        0
      );

      totalDuration = sections.reduce(
        (total, section) => total + Number(section.durationInHours),
        0
      );
    }

    if (sectionWeight) {
      totalWeight = +totalWeight + sectionWeight / 100;
    }

    if (sectionDuration) {
      const sectionDurationConverted = +(
        Number(sectionDuration.split(':')[0]) +
        Number(sectionDuration.split(':')[1]) / 60
      ).toFixed(2);

      totalDuration = +totalDuration + sectionDurationConverted;
    }

    setRemainingWeight(1 - totalWeight);
    setRemainingDuration(examDuration - totalDuration);
  }, [sectionWeight, sectionDuration, sections, examDuration]);

  const readableRemaningHours = useReadableDuration(remainingDuration);

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('SUBMIT')

    setCreatingSectionLoading(true);

    const sectionDurationConverted = +(
      Number(sectionDuration.split(':')[0]) +
      Number(sectionDuration.split(':')[1]) / 60
    ).toFixed(2);

    const newSection = {
      name: sectionName,
      description: sectionDescription,
      weight: sectionWeight / 100,
      durationInHours: sectionDurationConverted,
      // type: sectionType,
    };

    const response = await sectionService.createSection(examId, newSection);

    if (response.status >= 200 && response.status < 300) {
      toast.success('Seção criada com sucesso!', {
        duration: 3000,
        position: 'top-center',
      });
      deleteSuggestion(sectionIndex);
      setCreatingSectionLoading(false);
      onCreateSection();
      if (!setNewSection) return;
      setNewSection('');
    } else {
      toast.error('Erro ao criar seção', {
        duration: 3000,
        position: 'top-center',
      });
      setCreatingSectionLoading(false);
    }
  };

  const cleanHandler = () => {
    setSectionName('');
    setSectionDescription('');
    setSectionWeight(0);
    setSectionDuration('');

    setInputKey(Math.random().toString(36));
  };

  const deleteSuggestion = (index: number) => {
    if (!sectionsSuggestions) return;
    if (!setSectionsSuggestions) return;

    const updatedSections = sectionsSuggestions.filter(
      (section, i) => i !== index
    );
    setInputKey(Math.random().toString(36));

    setSectionsSuggestions(updatedSections);
  };

  const deleteSection = async () => {
    if (!setNewSection) return;
    setNewSection('');
    cleanHandler();
  };

  return (
    <div className={styles.section}>
      {creatingSectionLoading ? (
        <div className="loadingContainer">
          <CircularProgress style={{ color: 'var(--verde-1)' }} />
        </div>
      ) : (
        <>
          <div className={styles.cardHeader}>
            <h3>
              Nova seção {sectionType === 'project' ? 'projeto' : 'prova'} -
              Seção {sectionIndex + 1}
            </h3>
            <button onClick={cleanHandler}>Limpar informações</button>
          </div>
          <form onSubmit={submitHandler} id="createSectionForm">
            <div className={styles.formsContent}>
              <div className={styles.firstRow}>
                <InputField
                  labelBgColor="#eff0ef"
                  key={`sectionName-${inputKey}`}
                  label="Nome da seção"
                  required
                  type="text"
                  counter
                  min={3}
                  max={30}
                  value={sectionName ? sectionName[0].toUpperCase() + sectionName.slice(1) : sectionName}
                  setState={setSectionName}
                />
                <InputField
                  labelBgColor="#eff0ef"
                  key={`sectionWeight-${inputKey}`}
                  label="Peso da seção (%)"
                  type="number"
                  max={100}
                  min={1}
                  value={sectionWeight}
                  setState={setSectionWeight}
                  innerText={`restam ${(remainingWeight * 100).toFixed(
                    0
                  )}% do peso total`}
                  helperText="Peso da seção em relação ao teste inteiro."
                />
                <InputField
                  labelBgColor="#eff0ef"
                  key={`sectionDuration-${inputKey}`}
                  label="Duração (horas : minutos)"
                  type="time"
                  max={examDuration}
                  min={1}
                  value={sectionDuration}
                  setState={setSectionDuration}
                  innerText={`${
                    Math.floor(remainingDuration) !== 1 ? 'restam' : 'resta'
                  } ${remainingDuration > 0 ? readableRemaningHours : '0 horas'}`}
                  helperText="Tempo disponível para responder à seção, considerando a duração total do teste."
                />
              </div>
              <div>
                <InputField
                  labelBgColor="#eff0ef"
                  key={`sectionDescription-${inputKey}`}
                  label="Descrição da seção"
                  required
                  type="text"
                  rows={4}
                  counter
                  max={400}
                  min={1}
                  value={sectionDescription}
                  setState={setSectionDescription}
                  helperText="Breve descrição da seção."
                />
              </div>
            </div>
            <div className={styles.actions}>
              <Button
                type="button"
                actionType="action4"
                dimensions={
                  isSuggestionSection
                    ? { width: '17.2rem', height: '4.1rem' }
                    : { width: '9.8rem', height: '4.1rem' }
                }
                onClick={
                  isSuggestionSection
                    ? () => deleteSuggestion(sectionIndex)
                    : deleteSection
                }
              >
                <CloseRoundedIcon
                  style={{
                    fontSize: '2.4rem',
                    marginRight: '0.2rem',
                    color: 'var(--vermelho-1)',
                    opacity: 0.7,
                  }}
                />
                Excluir {isSuggestionSection && 'Sugestão'}
              </Button>
              <Button
                type="submit"
                form="createSectionForm"
                actionType="action3"
                dimensions={
                  isSuggestionSection
                    ? { width: '17.2rem', height: '4.1rem' }
                    : { width: '9.8rem', height: '4.1rem' }
                }
              >
                <CheckRoundedIcon
                  style={{
                    fontSize: '2.4rem',
                    marginRight: '0.2rem',
                    color: 'var(--azul-1)',
                  }}
                />
                {isSuggestionSection ? 'Aceitar sugestão' : 'Criar'}
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default SectionForm;
