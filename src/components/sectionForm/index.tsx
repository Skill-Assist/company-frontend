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

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
    setNewSection(false);
    cleanHandler();
  };

  return (
    <div className={styles.section}>
      {creatingSectionLoading ? (
        <div className="loadingContainer">
          <CircularProgress style={{ color: 'var(--green-1)' }} />
        </div>
      ) : (
        <>
          <div className={styles.cardHeader}>
            <h3>Nova seção - Seção {sectionIndex + 1}</h3>
            <button onClick={cleanHandler}>Limpar informações</button>
          </div>
          <form onSubmit={submitHandler}>
            <div className={styles.formsContent}>
              <div className={styles.firstRow}>
                <InputField
                  key={`sectionName-${inputKey}`}
                  label="Nome da seção"
                  required
                  type="text"
                  counter
                  min={3}
                  max={30}
                  value={sectionName[0].toUpperCase() + sectionName.slice(1)}
                  setState={setSectionName}
                />
                <InputField
                  key={`sectionWeight-${inputKey}`}
                  label="Peso da seção (%)"
                  type="number"
                  max={sectionWeight + remainingWeight * 100}
                  min={1}
                  value={sectionWeight}
                  setState={setSectionWeight}
                  innerText={`restam ${(remainingWeight * 100).toFixed(
                    0
                  )}% do peso total`}
                  helperText="Peso da seção em relação ao teste inteiro."
                />
                <InputField
                  key={`sectionDuration-${inputKey}`}
                  label="Duração (horas : minutos)"
                  type="time"
                  max={Number(
                    (
                      Number(sectionDuration.split(':')[0]) +
                      Number(sectionDuration.split(':')[1]) / 60 +
                      remainingDuration
                    ).toFixed(2)
                  )}
                  min={1}
                  value={sectionDuration}
                  setState={setSectionDuration}
                  innerText={`${
                    Math.floor(remainingDuration) !== 1 ? 'restam' : 'resta'
                  } ${Math.floor(remainingDuration)} hora${
                    Math.floor(remainingDuration) !== 1 ? 's' : ''
                  } e ${((remainingDuration % 1) * 60).toFixed(0)} minuto${
                    +((remainingDuration % 1) * 60).toFixed(0) !== 1 ? 's' : ''
                  }`}
                  helperText="Tempo disponível para responder à seção, considerando a duração total do teste."
                />
              </div>
              <div>
                <InputField
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
                actionType='action4'
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
                    color: 'rgba(255, 69, 69, 0.7)',
                  }}
                />
                Excluir {isSuggestionSection && 'Sugestão'}
              </Button>
              <Button
                type="submit"
                actionType='action3'
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
