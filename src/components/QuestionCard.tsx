import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, ChevronRight, ArrowLeft, Volume2, FastForward } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface QuestionCardProps {
  question: string;
  type: 'text' | 'number' | 'radio' | 'gender' | 'checkbox';
  options?: { value: string; label: string }[];
  value?: string | number | string[];
  onChange: (value: string | number | string[]) => void;
  onNext: () => void;
  onBack?: () => void;
  showBackButton?: boolean;
  clinicalNote?: string;
  nextButtonText?: string;
  disabled?: boolean;
  hideNextButton?: boolean;
  isAudioPlaying?: boolean;
  isAudioFinished?: boolean;
  isSkipAllowed?: boolean;
  onSkipAudio?: () => void;
}

const QuestionCard = ({
  question,
  type,
  options,
  value,
  onChange,
  onNext,
  onBack,
  showBackButton = false,
  clinicalNote,
  nextButtonText = "Continuar",
  disabled = false,
  hideNextButton = false,
  isAudioPlaying = false,
  isAudioFinished = true,
  isSkipAllowed = true,
  onSkipAudio
}: QuestionCardProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Show options only when audio is finished OR skip is allowed and user clicked skip
  const showOptions = isAudioFinished;

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && value && !disabled) {
      onNext();
    }
  };

  const handleButtonClick = () => {
    onNext();
  };

  const handleRadioChange = (newValue: string) => {
    setSelectedOption(newValue);
    onChange(newValue);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-background border border-border rounded-2xl p-6 space-y-5 shadow-sm">
        {/* Question */}
        <h3 className="text-lg font-semibold text-foreground leading-tight">
          {question}
        </h3>
        
        {/* Audio playing state - show when waiting for audio */}
        {!showOptions && (type === 'radio' || type === 'gender' || type === 'checkbox') && (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3 py-6 text-muted-foreground">
              <Volume2 className="w-5 h-5 text-primary animate-pulse" />
              <span className="text-sm font-medium">Escucha a Río...</span>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
            
            {/* Skip button - appears after 3 seconds */}
            {isSkipAllowed && onSkipAudio && (
              <Button
                onClick={onSkipAudio}
                variant="ghost"
                size="sm"
                className="w-full text-muted-foreground hover:text-foreground transition-all animate-fade-in"
              >
                <FastForward className="w-4 h-4 mr-2" />
                Saltar audio
              </Button>
            )}
          </div>
        )}
        
        {type === 'text' && (
          <Input
            value={value as string || ''}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe aquí..."
            className="text-base h-12 rounded-xl border-border focus:border-primary focus:ring-1 focus:ring-primary bg-background transition-all"
            autoFocus
          />
        )}

        {type === 'number' && (
          <Input
            type="number"
            value={value as number || ''}
            onChange={(e) => onChange(parseInt(e.target.value))}
            onKeyPress={handleKeyPress}
            placeholder="Tu edad..."
            className="text-base h-12 rounded-xl border-border focus:border-primary focus:ring-1 focus:ring-primary bg-background transition-all"
            autoFocus
            min={18}
            max={120}
          />
        )}

        {type === 'gender' && showOptions && (
          <RadioGroup
            value={value as string}
            onValueChange={handleRadioChange}
            className="space-y-2 animate-fade-in"
          >
            {[
              { value: 'male', label: 'Masculino' },
              { value: 'female', label: 'Femenino' },
              { value: 'other', label: 'Otro' },
            ].map((option) => (
              <div 
                key={option.value}
                className={cn(
                  "flex items-center space-x-3 p-4 rounded-xl border cursor-pointer transition-all duration-200",
                  "hover:border-primary/50 hover:bg-muted/30",
                  selectedOption === option.value 
                    ? "border-primary bg-primary/5" 
                    : "border-border"
                )}
              >
                <RadioGroupItem 
                  value={option.value} 
                  id={option.value} 
                  className="border-2 data-[state=checked]:border-primary data-[state=checked]:text-primary" 
                />
                <Label htmlFor={option.value} className="flex-1 cursor-pointer font-medium text-foreground">
                  {option.label}
                </Label>
                <ChevronRight className={cn(
                  "w-4 h-4 transition-all duration-200",
                  selectedOption === option.value ? "text-primary" : "text-muted-foreground/50"
                )} />
              </div>
            ))}
          </RadioGroup>
        )}

        {type === 'radio' && options && showOptions && (
          <RadioGroup
            value={value as string}
            onValueChange={handleRadioChange}
            className="space-y-2 animate-fade-in"
          >
            {options.map((option) => (
              <div 
                key={option.value}
                className={cn(
                  "flex items-center space-x-3 p-4 rounded-xl border cursor-pointer transition-all duration-200",
                  "hover:border-primary/50 hover:bg-muted/30",
                  selectedOption === option.value 
                    ? "border-primary bg-primary/5" 
                    : "border-border"
                )}
              >
                <RadioGroupItem 
                  value={option.value} 
                  id={option.value} 
                  className="border-2 data-[state=checked]:border-primary data-[state=checked]:text-primary" 
                />
                <Label htmlFor={option.value} className="flex-1 cursor-pointer font-medium text-foreground">
                  {option.label}
                </Label>
                <ChevronRight className={cn(
                  "w-4 h-4 transition-all duration-200",
                  selectedOption === option.value ? "text-primary" : "text-muted-foreground/50"
                )} />
              </div>
            ))}
          </RadioGroup>
        )}

        {type === 'checkbox' && options && showOptions && (
          <div className="space-y-2 animate-fade-in">
            {options.map((option) => {
              const selectedValues = (value as string[]) || [];
              const isChecked = selectedValues.includes(option.value);
              
              return (
                <div 
                  key={option.value}
                  onClick={() => {
                    const currentValues = (value as string[]) || [];
                    const newValues = isChecked
                      ? currentValues.filter(v => v !== option.value)
                      : [...currentValues, option.value];
                    onChange(newValues);
                  }}
                  className={cn(
                    "flex items-center space-x-3 p-4 rounded-xl border cursor-pointer transition-all duration-200",
                    "hover:border-primary/50 hover:bg-muted/30",
                    isChecked
                      ? "border-primary bg-primary/5" 
                      : "border-border"
                  )}
                >
                  <Checkbox 
                    checked={isChecked}
                    id={option.value}
                    className="border-2 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground" 
                  />
                  <Label htmlFor={option.value} className="flex-1 cursor-pointer font-medium text-foreground">
                    {option.label}
                  </Label>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {clinicalNote && (
        <Alert className="border-primary/20 bg-primary/5 rounded-xl">
          <Info className="h-4 w-4 text-primary" />
          <AlertDescription className="text-sm text-muted-foreground">
            <strong className="text-primary">Dato clínico:</strong> {clinicalNote}
          </AlertDescription>
        </Alert>
      )}

      {/* Back button */}
      {showBackButton && onBack && (
        <Button
          onClick={onBack}
          variant="ghost"
          className="w-full h-10 text-sm font-medium rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 group"
          size="sm"
        >
          <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Volver a la pregunta anterior
        </Button>
      )}

      {(type === 'text' || type === 'number') && !hideNextButton && (
        <Button
          onClick={handleButtonClick}
          disabled={!value || disabled}
          className="w-full h-12 text-base font-medium rounded-xl bg-foreground text-background hover:bg-foreground/90 transition-all duration-200 group"
          size="lg"
        >
          {nextButtonText}
          <ChevronRight className="ml-2 w-4 h-4 text-primary group-hover:translate-x-0.5 transition-transform" />
        </Button>
      )}
    </div>
  );
};

export default QuestionCard;