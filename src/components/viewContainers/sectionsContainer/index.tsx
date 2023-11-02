import { FC, FormEvent, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

import Plus from '@public/icons/fa/plus.svg';
import DisablePlus from '@public/icons/fa/disablePlus.svg';

// import SectionsContainerPlaceholder from '@/components/placeholders/sectionsContainerPlaceholder';
import Button from '@/components/UI/button';
import SectionForm from '@/components/sectionForm';
import SectionCard from '@/components/sectionCard';
import SectionsContainerPlaceholder from '@/components/placeholders/sectionsContainerPlaceholder';
import Modal from '@/components/modal';

import sectionService from '@/services/sectionService';

import { Section } from '@/types/section';

import { CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';

import styles from './styles.module.scss';

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
  isProjectSection: boolean,
  isTestSection: boolean,
  setSectionsSuggestions: (value: Section[]) => void,
  setSuggestionsLoading: (value: boolean) => void,
  setShowSetupSectionModal: (value: boolean) => void
) => {
  if (!isProjectSection && !isTestSection) {
    toast.error('Selecione pelo menos um tipo de seção', {
      duration: 3000,
      position: 'top-center',
    });
    return;
  }

  console.log('IsProjectSection: ', isProjectSection);
  console.log('IsTestSection: ', isTestSection);

  // setSuggestionsLoading(true);

  // const response = await sectionService.suggestSections(examId);

  // if (response.status >= 200 && response.status < 300) {
  //   setSectionsSuggestions(response.data);
  //   setSuggestionsLoading(false);
  // } else {
  //   toast.error('Erro ao sugerir seções', {
  //     duration: 3000,
  //     position: 'top-center',
  //   });
  //   setSuggestionsLoading(false);
  // }
  setShowSetupSectionModal(false);
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

  const [showSetupSectionModal, setShowSetupSectionModal] = useState(
    !sections || sections.length === 0 ? true : false
  );

  const [isProjectSection, setIsProjectSection] = useState(false);
  const [isTestSection, setIsTestSection] = useState(false);

  const StyledTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(() => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: 'var(--cinza-4)',
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: 'var(--cinza-4)',
      width: 188,
      fontSize: 10,
    },
  }));

  return (
    <>
      <div className={styles.container}>
        <div className={styles.sectionsContainer}>
          <div className={styles.sectionContainerHeader}>
            <h2>
              Nós oferecemos um sistema de recomendação de{' '}
              <span>seções prontas e personalizadas</span> para o objetivo do
              seu teste, e que irão facilitar a navegação pelas questões!
            </h2>
            <div>
              <StyledTooltip
                title={
                  (sectionsSuggestions && sectionsSuggestions.length > 0) ||
                  suggestionsLoading
                    ? 'Você precisa aceitar ou negar as sugestões antes de criar uma nova seção.'
                    : sections &&
                      sections.length > 0 &&
                      sections.reduce(
                        (acumulador, section) =>
                          acumulador + section.durationInHours,
                        0
                      ) >= examDuration
                    ? 'Não é possível criar novas seções pois o limite de duração do teste já foi atingido.'
                    : ''
                }
              >
                <span>
                  <Button
                    onClick={() => setNewSection(true)}
                    actionType="action2"
                    type="button"
                    dimensions={{ width: '25rem!important', height: '5rem' }}
                    disabled={
                      (sectionsSuggestions && sectionsSuggestions.length > 0) ||
                      suggestionsLoading ||
                      (sections &&
                        sections.length > 0 &&
                        sections.reduce(
                          (acumulador, section) =>
                            acumulador + section.durationInHours,
                          0
                        ) >= examDuration)
                    }
                  >
                    <div className={styles.newSectionBtn}>
                      <Image
                        src={
                          (sectionsSuggestions &&
                            sectionsSuggestions.length > 0) ||
                          suggestionsLoading ||
                          (sections &&
                            sections.length > 0 &&
                            sections.reduce(
                              (acumulador, section) =>
                                acumulador + section.durationInHours,
                              0
                            ) >= examDuration)
                            ? DisablePlus
                            : Plus
                        }
                        width={44}
                        height={44}
                        alt="plus_icon"
                        style={
                          (sectionsSuggestions &&
                            sectionsSuggestions.length > 0) ||
                          suggestionsLoading ||
                          (sections &&
                            sections.length > 0 &&
                            sections.reduce(
                              (acumulador, section) =>
                                acumulador + section.durationInHours,
                              0
                            ) >= examDuration)
                            ? { borderColor: '#8C8895' }
                            : {}
                        }
                      />
                      Criar nova seção
                    </div>
                  </Button>
                </span>
              </StyledTooltip>
            </div>
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
                  <CircularProgress style={{ color: 'var(--verde-1)' }} />
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
                        examDuration={examDuration}
                        sections={sections}
                        onEditSection={onCreateSection}
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
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {showSetupSectionModal && (
          <Modal
            handleClose={() => {}}
            dimensions={{
              width: '927px',
              height: '769px',
            }}
            sidebarOn
            closeIcon
          >
            {false ? (
              <div className="loadingContainer">
                <CircularProgress style={{ color: 'var(--verde-1)' }} />
              </div>
            ) : (
              <div className={styles.setupTestModal}>
                <h1>Vamos configurar o teste!</h1>
                <p className={styles.introP}>
                  Nós oferecemos um sistema de recomendação de seções prontas e
                  personalizadas para o objetivo do seu teste, e que irão
                  facilitar a navegação pelas questões! <br />
                  <span>Escolha os tipos de seção:</span>
                </p>
                <div className={styles.setupOptions}>
                  <div className={styles.setupOption}>
                    <h3>Seção Projeto</h3>
                    <p>
                      Seção com apenas{' '}
                      <span> 1 tipo de questão, a questão desafio.</span>
                    </p>
                    <p>
                      Essa questão contém um <span>projeto</span> que o
                      candidato deverá desenvolver e que{' '}
                      <span>pode ser entregue a qualquer momento</span>
                      enquanto o teste estiver disponível.
                    </p>
                    <br />
                    <p>
                      É possível ter apenas 1 seção projeto no teste, mas você
                      pode ter mais de uma questão desafio dentro da seção.{' '}
                    </p>
                    <div className={styles.checkboxContainer}>
                      <label className={styles.checkmarkContainer}>
                        <input
                          onChange={() => {
                            setIsProjectSection(!isProjectSection);
                          }}
                          type="checkbox"
                          id="projectSection"
                          name="projectSection"
                        />
                        <span className={styles.checkmark}></span>
                      </label>
                      <label className={styles.label} htmlFor="projectSection">
                        Quero uma sugestão de seção projeto.
                      </label>
                    </div>
                  </div>
                  <div className={styles.setupOption}>
                    <h3>Seção Prova</h3>
                    <p>
                      Seção com questões de <span>3 tipos:</span>
                      <br /> Objetiva, Discursiva e Programação. As questões
                      devem ser respondidas dentro do tempo limite da seção.
                    </p>
                    <br />
                    <p>
                      A questão <span>objetiva</span> possui 5 alternativas com
                      1 correta. A <span>discursiva</span> é respondida em forma
                      de texto com critérios de correção. E a questão de{' '}
                      <span>programação</span> possui desafio de código com
                      testes.
                    </p>

                    <div className={styles.checkboxContainer}>
                      <label className={styles.checkmarkContainer}>
                        <input
                          onChange={() => {
                            setIsTestSection(!isTestSection);
                          }}
                          type="checkbox"
                          id="testSection"
                          name="testSection"
                        />
                        <span className={styles.checkmark}></span>
                      </label>
                      <label className={styles.label} htmlFor="testSection">
                        Quero sugestões de seções prova.
                      </label>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() =>
                    fetchSectionsSuggestions(
                      examId.toString(),
                      isProjectSection,
                      isTestSection,
                      setSectionsSuggestions,
                      setSuggestionsLoading,
                      setShowSetupSectionModal
                    )
                  }
                  type="button"
                  actionType="bigConfirm"
                >
                  Confimar
                </Button>
              </div>
            )}
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};

export default SectionsContainer;
