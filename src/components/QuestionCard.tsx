import type { Question } from '../types/quiz';

type QuestionCardProps = {
  question: Question;
  selectedOptionId?: string;
  onSelect: (optionId: string) => void;
  animationKey?: number;
};

export function QuestionCard({ question, selectedOptionId, onSelect, animationKey }: QuestionCardProps) {
  return (
    <section key={animationKey} className="panel question-panel panel-enter">
      <div className="eyebrow">{question.category}</div>
      <h2 className="section-title">{question.text}</h2>
      <div className="option-list">
        {question.options.map((option) => {
          const checked = selectedOptionId === option.id;

          return (
            <label key={option.id} className={`option-card ${checked ? 'selected' : ''}`}>
              <input
                type="radio"
                name={`question-${question.id}`}
                checked={checked}
                onChange={() => onSelect(option.id)}
              />
              <span className="option-letter">{option.id.toUpperCase()}</span>
              <span className="option-label">{option.label}</span>
            </label>
          );
        })}
      </div>
    </section>
  );
}
