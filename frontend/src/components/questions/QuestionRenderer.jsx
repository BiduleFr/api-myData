import SliderQuestion from './SliderQuestion.jsx';
import ScaleQuestion from './ScaleQuestion.jsx';
import BooleanQuestion from './BooleanQuestion.jsx';
import ChoiceQuestion from './ChoiceQuestion.jsx';
import MultiChoiceQuestion from './MultiChoiceQuestion.jsx';
import NumberQuestion from './NumberQuestion.jsx';
import TimeQuestion from './TimeQuestion.jsx';
import TextQuestion from './TextQuestion.jsx';
import QuickStepperQuestion from './QuickStepperQuestion.jsx';
import BodyMapQuestion from './BodyMapQuestion.jsx';
import TimelineQuestion from './TimelineQuestion.jsx';
import RatingQuestion from './RatingQuestion.jsx';
import DurationQuestion from './DurationQuestion.jsx';
import DualRatingQuestion from './DualRatingQuestion.jsx';

const REGISTRY = {
  slider: SliderQuestion,
  scale: ScaleQuestion,
  boolean: BooleanQuestion,
  choice: ChoiceQuestion,
  multichoice: MultiChoiceQuestion,
  number: NumberQuestion,
  time: TimeQuestion,
  text: TextQuestion,
  quickstep: QuickStepperQuestion,
  bodymap: BodyMapQuestion,
  timeline: TimelineQuestion,
  rating: RatingQuestion,
  duration: DurationQuestion,
  dualrating: DualRatingQuestion
};

export default function QuestionRenderer({ question, value, onChange }) {
  const Component = REGISTRY[question.type];
  if (!Component) return null;
  return <Component question={question} value={value} onChange={onChange} />;
}
