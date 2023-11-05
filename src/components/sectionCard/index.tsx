import { FC, RefObject, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';

import Button from '../UI/button';
import Modal from '../modal';

import Options from '@public/icons/fa/options.svg';
import Edit from '@public/icons/fa/edit.svg';
import Delete from '@public/icons/fa/delete.svg';
import warning from '@public/lottie/warning.json';

import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { CircularProgress } from '@mui/material';

import { Section } from '@/types/section';

import styles from './styles.module.scss';
import InputField from '../UI/inputField';
import { useReadableDuration } from '@/hooks/readableDuration';
import sectionService from '@/services/sectionService';
import toast from 'react-hot-toast';

interface Props {
  section: Section;
  index: number;
  examId: number;
  sections?: Section[];
  examDuration: number;
  onEditSection: () => void;
}

const SectionCard: FC<Props> = ({
  section,
  index,
  examId,
  sections,
  examDuration,
  onEditSection,
}: Props) => {
  const [isDropdownlOpen, setIsDropdownOpen] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const [inputKey, setInputKey] = useState('');

  const [sectionName, setSectionName] = useState(section.name);
  const [sectionWeight, setSectionWeight] = useState(+section.weight * 100);
  const [sectionDuration, setSectionDuration] = useState(
    `${Math.floor(section.durationInHours) < 10 && '0'}${Math.floor(
      section.durationInHours
    )}:${Math.floor((section.durationInHours % 1) * 60).toLocaleString(
      'en-US',
      {
        minimumIntegerDigits: 2,
        useGrouping: false,
      }
    )}`
  );
  const [sectionDescription, setSectionDescription] = useState(
    section.description
  );
  const [remainingWeight, setRemainingWeight] = useState(1);
  const [remainingDuration, setRemainingDuration] = useState(examDuration);

  const useOutsideAlerter = (ref: RefObject<HTMLDivElement>) => {
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          setIsDropdownOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [ref]);
  };

  const wrapperRef = useRef<HTMLDivElement>(null);
  useOutsideAlerter(wrapperRef);

  const deleteHandler = async () => {
    setDeleteLoading(true);
  };

  const updateHandler = async (e: any) => {
    e.preventDefault();
    setEditLoading(true);

    const sectionDurationConverted = +(
      Number(sectionDuration.split(':')[0]) +
      Number(sectionDuration.split(':')[1]) / 60
    ).toFixed(2);

    const updatedSection = {
      name: sectionName ? sectionName : section.name,
      description: sectionDescription
        ? sectionDescription
        : section.description,
      weight: sectionWeight ? +sectionWeight / 100 : +section.weight / 100,
      durationInHours: sectionDuration
        ? sectionDurationConverted
        : section.durationInHours,
    };

    const response = await sectionService.updateSection(section.id, updatedSection);

    if (response.status >= 200 && response.status < 300) {
      toast.success('Seção editada com sucesso!', {
        duration: 3000,
        position: 'top-center',
      });
      setIsEditing(false);
      setEditLoading(false);
      onEditSection()
    } else {
      toast.error('Erro ao criar seção', {
        duration: 3000,
        position: 'top-center',
      });
      setIsEditing(false);
      setEditLoading(false);
    }

    setEditLoading(false);
  };

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
      totalWeight = (totalWeight - +section.weight) + sectionWeight / 100;
    }

    if (sectionDuration) {
      const sectionDurationConverted = +(
        Number(sectionDuration.split(':')[0]) +
        Number(sectionDuration.split(':')[1]) / 60
      ).toFixed(2);

      totalDuration = totalDuration - section.durationInHours + sectionDurationConverted;
    }

    setRemainingWeight(1 - totalWeight);
    setRemainingDuration(examDuration - totalDuration);
  }, [sectionWeight, sectionDuration, sections, examDuration]);

  const readableRemaningHours = useReadableDuration(remainingDuration);

  // console.log(section);

  return (
    <>
      <div style={{ position: 'relative' }} ref={wrapperRef}>
        {!isEditing && (
          <div
            className={styles.cardOptions}
          >
            <div onClick={() => setIsDropdownOpen((prevState) => !prevState)}>
              <Image src={Options} alt="options" />
            </div>
            <div
              className={`${styles.dropdownMenu} ${
                isDropdownlOpen ? styles.open : styles.closed
              }`}
            >
              <ul>
                <li onClick={() => setIsEditing(true)}>
                  <Image src={Edit} alt="editIcon" />
                  Editar
                </li>
                <li onClick={() => setShowDeleteModal(true)}>
                  <Image src={Delete} alt="deleteIcon" />
                  Deletar
                </li>
              </ul>
            </div>
          </div>
        )}
        <Link
          href={isEditing ? '#' : `/exams/${examId}/${section.id}`}
          className={styles.section}
          style={isEditing ? { boxShadow: 'none', cursor: 'unset' } : {}}
          onClick={(event) => (isEditing ? event.preventDefault() : null)}
        >
          <div className={styles.cardHeader}>
            <h3>
              Seção {index + 1}
            </h3>
          </div>
          <div className={styles.formsContent}>
            <div className={styles.firstRow}>
              {isEditing ? (
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
              ) : (
                <div className={styles.field}>
                  <p>
                    <span>Nome da seção:</span>"
                    {section.name[0].toUpperCase() + section.name.slice(1)}"
                  </p>
                </div>
              )}
              {isEditing ? (
                <InputField
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
              ) : (
                <div className={styles.field}>
                  <p>
                    <span>Peso da seção:</span>
                    {+section.weight * 100}%
                  </p>
                </div>
              )}
              {isEditing ? (
                <InputField
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
              ) : (
                <div className={styles.field}>
                  <p>
                    <span>Duração da seção:</span>{' '}
                    {section.durationInHours > 1
                      ? section.durationInHours + ' horas'
                      : section.durationInHours + ' hora'}
                  </p>
                </div>
              )}
            </div>
            {isEditing ? (
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
            ) : (
              <div className={styles.field}>
                <p>
                  <span>Descrição:</span> {section.description}
                </p>
              </div>
            )}
            {isEditing && (
              <div className={styles.actions}>
                <Button
                  type="button"
                  actionType="cancel"
                  onClick={(e: any) => {
                    e.preventDefault();
                    setIsEditing(false);
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  actionType="confirm"
                  onClick={updateHandler}
                >
                  Editar
                </Button>
              </div>
            )}
          </div>
        </Link>
      </div>

      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {showDeleteModal && (
          <Modal
            handleClose={() => setShowDeleteModal(false)}
            dimensions={{
              width: '744px',
              height: '476px',
            }}
            sidebarOn
          >
            {deleteLoading ? (
              <div className="loadingContainer">
                <CircularProgress style={{ color: 'var(--verde-1)' }} />
              </div>
            ) : (
              <div className={styles.deleteModalContent}>
                <div className={styles.lottie}>
                  <Lottie animationData={warning} loop={false} />
                </div>
                <h1>
                  Você realmente deseja excluir a seção “
                  {section.name[0].toUpperCase() + section.name.slice(1)}
                  ”?
                </h1>
                <p>
                  Ao excluir a seção, ela será permanentemente removido da
                  plataforma.
                </p>
                <div>
                  <Button
                    type="button"
                    actionType="cancel"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="button"
                    actionType="delete"
                    onClick={deleteHandler}
                  >
                    Excluir
                  </Button>
                </div>
              </div>
            )}
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};

export default SectionCard;
