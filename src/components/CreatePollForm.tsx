import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';
import { Sparkles, Plus, X, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { GlassCard } from '@/components/ui/GlassCard';
import { usePollStore } from '@/stores/pollStore';
import { toast } from 'sonner';

export function CreatePollForm() {
  const navigate = useNavigate();
  const addPoll = usePollStore((state) => state.addPoll);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>(['']);
  const [isCreating, setIsCreating] = useState(false);

  const addSuggestionField = () => {
    setSuggestions([...suggestions, '']);
  };

  const removeSuggestionField = (index: number) => {
    setSuggestions(suggestions.filter((_, i) => i !== index));
  };

  const updateSuggestion = (index: number, value: string) => {
    const newSuggestions = [...suggestions];
    newSuggestions[index] = value;
    setSuggestions(newSuggestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Please enter a title for your poll');
      return;
    }

    const validSuggestions = suggestions.filter((s) => s.trim());
    
    setIsCreating(true);
    
    // Simulate a small delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 500));

    const pollId = nanoid(10);
    const editToken = nanoid(20);
    
    const poll = {
      id: pollId,
      title: title.trim(),
      description: description.trim(),
      suggestions: validSuggestions.map((text) => ({
        id: nanoid(8),
        text: text.trim(),
        votes: 0,
        createdAt: new Date(),
      })),
      editToken,
      createdAt: new Date(),
      totalVotes: 0,
    };

    addPoll(poll);
    
    toast.success('Poll created successfully!', {
      description: 'Redirecting to your poll...',
    });
    
    // Navigate to the poll with edit token
    navigate(`/poll/${pollId}?token=${editToken}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-2xl mx-auto"
    >
      <GlassCard hover={false} className="p-8">
        <div className="mb-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary mb-4"
          >
            <Lightbulb className="w-8 h-8 text-primary-foreground" />
          </motion.div>
          <h2 className="text-3xl font-bold font-display gradient-text">
            Create Your Poll
          </h2>
          <p className="text-muted-foreground mt-2">
            Gather ideas and let people vote on them
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-foreground">
              Poll Title *
            </label>
            <Input
              id="title"
              placeholder="What should we name our new mascot?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-12 text-lg"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium text-foreground">
              Description (optional)
            </label>
            <Textarea
              id="description"
              placeholder="Add some context for your poll..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px] resize-none"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">
                Initial Suggestions (optional)
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addSuggestionField}
                className="gap-1 text-primary"
              >
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>
            
            <div className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2"
                >
                  <Input
                    placeholder={`Suggestion ${index + 1}`}
                    value={suggestion}
                    onChange={(e) => updateSuggestion(index, e.target.value)}
                  />
                  {suggestions.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSuggestionField(index)}
                      className="text-muted-foreground hover:text-destructive shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              type="submit"
              disabled={isCreating}
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
            >
              {isCreating ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="h-5 w-5" />
                </motion.div>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Create Poll
                </>
              )}
            </Button>
          </motion.div>
        </form>
      </GlassCard>
    </motion.div>
  );
}
