'use client';

import * as React from 'react';

import './styles.css';

export type Step = { selector: string; content: string };
export type Steps = Step[];

const Tour = ({
  isRun,
  steps,
  buttonsClassName,
  saveKey = 'tour-is-done',
  nextText = 'next',
  previewText = 'preview',
  doneText = 'done',
}: {
  isRun: boolean;
  steps: Steps;
  buttonsClassName?: { next?: string; preview?: string };
  saveKey?: string;
  nextText?: string;
  previewText?: string;
  doneText?: string;
}) => {
  const [activeStep, setActiveStep] = React.useState(0);
  const isTourAddedRef = React.useRef<boolean>(false);

  React.useEffect(() => {
    const addTour = (activeStep: number) => {
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];

        const element = document.querySelector(step.selector);
        if (element && activeStep === i) {
          isTourAddedRef.current = true;
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
          document.body.style.overflow = 'hidden';
          element.classList.add('active-tour');
          const modal = document.createElement('div');
          modal.classList.add('tour-tooltip');

          const content = document.createElement('div');
          content.classList.add('content');

          const closeBtn = document.createElement('span');
          closeBtn.classList.add('close-btn');
          closeBtn.innerHTML = '&times;';
          closeBtn.id = 'close-btn';
          closeBtn.addEventListener('click', () => {
            setActiveStep(0);
            element?.classList.remove('active-tour');
            const activeSection = document.querySelector('.tour-tooltip');
            activeSection?.remove();
            document.body.style.overflow = 'auto';
          });

          const text = document.createElement('p');
          text.textContent = step.content;

          const buttonContainer = document.createElement('div');
          buttonContainer.classList.add('button-container');

          const prevBtn = document.createElement('button');
          prevBtn.type = 'button';
          prevBtn.textContent = previewText;
          prevBtn.addEventListener('click', () => {
            setActiveStep(activeStep - 1);
            element?.classList.remove('active-tour');
            const activeSection = document.querySelector('.tour-tooltip');
            activeSection?.remove();
            addTour(activeStep - 1);
          });
          prevBtn.className = buttonsClassName?.preview || '';
          if (i === 0) {
            prevBtn.disabled = true;
          }

          const nextBtn = document.createElement('button');
          nextBtn.textContent = nextText;
          nextBtn.type = 'button';
          nextBtn.className = buttonsClassName?.next || '';
          if (steps.length === i + 1) {
            nextBtn.textContent = doneText;
          }
          nextBtn.addEventListener('click', () => {
            setActiveStep(activeStep + 1);
            element?.classList.remove('active-tour');
            const activeSection = document.querySelector('.tour-tooltip');
            activeSection?.remove();
            if (steps.length !== i + 1) {
              addTour(activeStep + 1);
            } else {
              localStorage.setItem(saveKey, 'true');
              document.body.style.overflow = 'auto';
            }
          });

          buttonContainer.appendChild(prevBtn);
          buttonContainer.appendChild(nextBtn);
          content.appendChild(closeBtn);
          content.appendChild(text);
          content.appendChild(buttonContainer);
          modal.appendChild(content);
          element.appendChild(modal);
          break;
        }
      }
    };
    if (isRun && !isTourAddedRef.current && !localStorage.getItem(saveKey)) {
      addTour(activeStep);
    }
    return () => {};
  }, [activeStep, isRun, steps]);

  return <></>;
};

export default Tour;
