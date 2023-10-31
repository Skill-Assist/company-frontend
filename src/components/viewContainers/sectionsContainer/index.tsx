import { FC, FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { BsFillTrashFill } from 'react-icons/bs';
import Image from 'next/image';

import Plus from '@public/icons/mui/plus.svg';
import DisablePlus from '@public/icons/mui/disablePlus.svg';

import SectionsContainerPlaceholder from '@/components/placeholders/sectionsContainerPlaceholder';
import Button from '@/components/UI/button';
import SectionForm from '@/components/sectionForm';

import sectionService from '@/services/sectionService';

import { Section } from '@/types/section';

import { CircularProgress } from '@mui/material';

import styles from './styles.module.scss';
import SectionCard from '@/components/sectionCard';

interface Props {
  sections: Section[] | undefined;
  examId: number;
  examDuration: number;
  onCreateSection: () => void;
  headerOpen: boolean;
}

const dropIn = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    duration: 0.4,
  },
  exit: {
    opacity: 0,
  },
};

const fetchSectionsSuggestions = async (
  examId: string,
  setSectionsSuggestions: (value: Section[]) => void,
  setSuggestionsLoading: (value: boolean) => void
) => {
  setSuggestionsLoading(true);

  const response = await sectionService.suggestSections(examId);

  console.log(response);

  if (response.status >= 200 && response.status < 300) {
    setSectionsSuggestions(response.data);
    setSuggestionsLoading(false);
  } else {
    toast.error('Erro ao sugerir seções', {
      duration: 3000,
      position: 'top-center',
    });
    setSuggestionsLoading(false);
  }
};

const SectionsContainer: FC<Props> = ({
  examId,
  sections,
  examDuration,
  onCreateSection,
  headerOpen,
}: Props) => {
  const [newSection, setNewSection] = useState(false);

  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [sectionsSuggestions, setSectionsSuggestions] = useState<
    {
      name: string;
      description: string;
    }[]
  >();

  useEffect(() => {
    if (!sections || sections.length === 0) {
      console.log('oi');
      fetchSectionsSuggestions(
        examId.toString(),
        setSectionsSuggestions,
        setSuggestionsLoading
      );
    } else {
      setSectionsSuggestions(undefined);
    }
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.sectionsContainer}>
        <div className={styles.sectionContainerHeader}>
          <h2 onClick={() => console.log(sectionsSuggestions)}>
            Nós oferecemos um sistema de recomendação de{' '}
            <span>seções prontas e personalizadas</span> para o objetivo do seu
            teste, e que irão facilitar a navegação pelas questões!
          </h2>
          <Button
            onClick={() => setNewSection(true)}
            backgroundColor="var(--green-2)"
            fontColor="var(--white)"
            fontSize="1.8rem"
            fontWeight="400"
            type="button"
            dimensions={{ width: '25rem!important', height: '5rem' }}
            disabled={(sectionsSuggestions && sectionsSuggestions.length > 0) || suggestionsLoading}
          >
            <div className={styles.newSectionBtn}>
              <Image
                src={
                  sectionsSuggestions && sectionsSuggestions.length > 0
                    ? DisablePlus
                    : Plus
                }
                width={44}
                height={44}
                alt="plus_icon"
                style={
                  sectionsSuggestions && sectionsSuggestions.length > 0
                    ? { borderColor: '#8C8895' }
                    : {}
                }
              />
              Criar nova seção
            </div>
          </Button>
        </div>
        <div
          className={`${styles.sectionContent} ${
            headerOpen ? styles.headerOpen : null
          }`}
        >
          <AnimatePresence
            initial={false}
            mode="wait"
            onExitComplete={() => null}
          >
            {suggestionsLoading ? (
              <div className="loadingContainer">
                <CircularProgress style={{ color: 'var(--green-1)' }} />
              </div>
            ) : (
              sectionsSuggestions &&
              sectionsSuggestions.length > 0 &&
              sectionsSuggestions.map((suggestion, index) => {
                return (
                  <SectionForm
                    isSuggestion
                    key={suggestion.name + index}
                    sectionIndex={index}
                    suggestionName={suggestion.name}
                    suggestionDescription={suggestion.description}
                    examDuration={examDuration}
                    examId={examId}
                    sections={sections}
                    onCreateSection={onCreateSection}
                    sectionsSuggestions={sectionsSuggestions}
                    setSectionsSuggestions={setSectionsSuggestions}
                  />
                );
              })
            )}

            {/* FORMULÁRIO DE NOVA SECTION */}
            {!suggestionsLoading && newSection && (
              <motion.div
                variants={dropIn}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <SectionForm
                  key={Math.random()}
                  sectionIndex={sections ? sections.length : 1}
                  examDuration={examDuration}
                  examId={examId}
                  sections={sections}
                  onCreateSection={onCreateSection}
                  setNewSection={setNewSection}
                />
              </motion.div>
            )}

            {!suggestionsLoading &&
              (newSection ||
                (sectionsSuggestions && sectionsSuggestions?.length > 0)) &&
              sections &&
              sections.length > 0 && <div className={styles.divisor}>.</div>}

            {/* MAP DE SECTIONS EXISTENTES */}
            {!suggestionsLoading &&
              sections &&
              sections.length > 0 &&
              sections.map((section, index) => {
                return (
                  <motion.div
                    variants={dropIn}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    key={section.id}
                  >
                    <SectionCard
                      section={section}
                      index={index}
                      examId={examId}
                    />
                  </motion.div>
                );
              })}
            {/* PLACEHOLDER */}
            {!suggestionsLoading &&
              !newSection &&
              sectionsSuggestions?.length === 0 &&
              sections?.length === 0 && (
                <motion.div
                  className={styles.placeholderContainer}
                  variants={dropIn}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <SectionsContainerPlaceholder
                    onClick={() => setNewSection(true)}
                  />
                </motion.div>
              )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SectionsContainer;
